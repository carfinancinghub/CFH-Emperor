// File: verificationRoutes.test.ts
// Path: backend/routes/__tests__/verificationRoutes.test.ts
// Purpose: Tests the security and auditing features of the verification API.

import request from 'supertest';
import express, { Application } from 'express';
import verificationRouter from '../verificationRoutes'; // Assuming the file is renamed
import SecurityLogger from '@/services/security/SecurityLogger';

// --- Mocks ---
const mockAuthMiddleware = jest.fn();
jest.mock('@/middleware/auth', () => ({
  __esModule: true,
  default: (req: any, res: any, next: any) => mockAuthMiddleware(req, res, next),
}));

const mockVerification = { findOne: jest.fn(), findOneAndUpdate: jest.fn() };
jest.mock('@/models/Verification', () => mockVerification); // Adjust path as needed

jest.mock('@/services/security/SecurityLogger', () => ({
    logSecurityEvent: jest.fn(),
}));

// --- Test Setup ---
const app: Application = express();
app.use(express.json());
app.use('/api/verification', verificationRouter);

describe('Verification API Routes', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('PATCH /api/verification/:userId', () => {
        
        it('should return 403 Forbidden if the user is not an admin', async () => {
            mockAuthMiddleware.mockImplementation((req, res, next) => {
                req.user = { _id: 'user-456', role: 'buyer' }; // Not an admin
                next();
            });

            const res = await request(app).patch('/api/verification/user-123').send({ status: 'verified' });

            expect(res.status).toBe(403);
        });

        it('should update status, create an audit log, and prevent mass assignment for an admin user', async () => {
            mockAuthMiddleware.mockImplementation((req, res, next) => {
                req.user = { _id: 'admin-789', role: 'admin' };
                next();
            });
            mockVerification.findOneAndUpdate.mockResolvedValue({ userId: 'user-123', status: 'verified' });

            // Send a body with extra, unauthorized fields
            const maliciousBody = { status: 'verified', notes: 'Approved', isAdmin: true };
            
            const res = await request(app).patch('/api/verification/user-123').send(maliciousBody);

            expect(res.status).toBe(200);

            // 1. Verify Mass Assignment was prevented
            const updateCall = mockVerification.findOneAndUpdate.mock.calls[0][1];
            expect(updateCall.$set).toEqual({ status: 'verified', notes: 'Approved' });
            expect(updateCall.$set.isAdmin).toBeUndefined(); // Crucial security check

            // 2. Verify Audit Trail was created
            expect(SecurityLogger.logSecurityEvent).toHaveBeenCalledWith(
                'ADMIN_UPDATE_VERIFICATION',
                'CRITICAL',
                { adminId: 'admin-789', targetUserId: 'user-123', newStatus: 'verified' }
            );
        });
    });
});