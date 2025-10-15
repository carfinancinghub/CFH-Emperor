// ----------------------------------------------------------------------
// File: onboardingController.test.ts
// Path: backend/src/controllers/__tests__/onboardingController.test.ts
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// Integration tests for the smart, role-aware onboarding controller.
//
// @architectural_notes
// - **Testing Role-Based Logic**: The core of this suite is to verify that
//   the controller serves the correct, personalized onboarding track based
//   on the authenticated user's role. This validates our key architectural
//   upgrade for this module.
//
// ----------------------------------------------------------------------

import request from 'supertest';
import express, { Application } from 'express';
import * as onboardingController from '../onboardingController';
import User from '@/models/User';

// --- Mocks ---
jest.mock('@/models/User');

const mockAuthMiddleware = jest.fn();
jest.mock('@/middleware/auth', () => ({
    __esModule: true,
    auth: (req: any, res: any, next: any) => mockAuthMiddleware(req, res, next),
}));

// --- Test Setup ---
const app: Application = express();
app.use(express.json());
// Create a dummy router for testing the controller functions
const router = express.Router();
router.get('/progress', (req, res) => onboardingController.getOnboardingProgress(req as any, res));
router.post('/complete', (req, res) => onboardingController.completeOnboardingTask(req as any, res));
app.use('/api/onboarding', (req, res, next) => mockAuthMiddleware(req, res, next), router);


describe('Onboarding Controller', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return the "seller" onboarding track for a user with the seller role', async () => {
    mockAuthMiddleware.mockImplementation((req, res, next) => {
        req.user = { id: 'seller-123' };
        next();
    });
    // Mock the DB to return a user with the 'seller' role
    (User.findById as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue({ role: 'seller', onboardingTasks: [] })
    });

    const res = await request(app).get('/api/onboarding/progress');
    
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    // Check for a task that is specific to the seller track
    expect(res.body.some((task: any) => task.id === 'create_listing')).toBe(true);
    // Check that a buyer-specific task is NOT present
    expect(res.body.some((task: any) => task.id === 'set_preferences')).toBe(false);
  });

  it('should return the "buyer" onboarding track for a user with the buyer role', async () => {
    mockAuthMiddleware.mockImplementation((req, res, next) => {
        req.user = { id: 'buyer-456' };
        next();
    });
    (User.findById as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue({ role: 'buyer', onboardingTasks: [] })
    });

    const res = await request(app).get('/api/onboarding/progress');

    expect(res.status).toBe(200);
    // Check for a task that is specific to the buyer track
    expect(res.body.some((task: any) => task.id === 'set_preferences')).toBe(true);
    // Check that a seller-specific task is NOT present
    expect(res.body.some((task: any) => task.id === 'create_listing')).toBe(false);
  });
});