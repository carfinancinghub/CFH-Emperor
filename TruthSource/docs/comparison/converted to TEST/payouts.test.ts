// ----------------------------------------------------------------------
// File: payouts.test.ts
// Path: backend/src/routes/__tests__/payouts.test.ts
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// Integration tests for the resilient, asynchronous payout API.
//
// @architectural_notes
// - **Testing Asynchronous Job Creation**: This suite's primary goal is to
//   verify our asynchronous architecture. It confirms that the API endpoint
//   correctly adds a job to the background queue and updates the local
//   database status to 'Processing', rather than waiting for the payout
//   to complete.
//
// ----------------------------------------------------------------------

import request from 'supertest';
import express, { Application } from 'express';
import payoutRouter from '../payouts';
import Ledger from '@/models/Ledger';
import queue from '@/services/queue';

// --- Mocks ---
const mockAuthMiddleware = (req: any, res: any, next: any) => {
    req.user = { id: 'admin-123', role: 'admin' };
    next();
};
// In the payouts.ts file, the adminOnly middleware would check req.user.role
const mockAdminOnlyMiddleware = (req: any, res: any, next: any) => {
    if (req.user?.role === 'admin') return next();
    return res.status(403).json({ message: 'Forbidden' });
};
jest.mock('@/models/Ledger');
jest.mock('@/services/queue');

// --- Test Setup ---
const app: Application = express();
app.use(express.json());
// Apply mock middleware for testing
app.use('/api/payouts', mockAuthMiddleware, mockAdminOnlyMiddleware, payoutRouter);


describe('Payouts API Route', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should add a payout job to the queue and return 202 Accepted', async () => {
    const mockSave = jest.fn().mockResolvedValue(true);
    const mockLedger = { _id: 'ledger-123', paid: false, recipient: 'seller-abc', amount: 5000, save: mockSave };
    (Ledger.findById as jest.Mock).mockResolvedValue(mockLedger);
    (queue.add as jest.Mock).mockResolvedValue({ id: 'job-567' });

    const res = await request(app).post('/api/payouts/ledger-123/pay');
    
    expect(res.status).toBe(202); // 202 Accepted indicates async processing
    expect(res.body.message).toContain('Payout processing has been initiated');
    
    // Verify a job was added to the queue
    expect(queue.add).toHaveBeenCalledWith(
      'process-payout',
      { ledgerId: 'ledger-123', recipientId: 'seller-abc', amount: 5000 }
    );

    // Verify the local status was updated
    expect(mockLedger.status).toBe('Processing');
    expect(mockSave).toHaveBeenCalled();
  });

  it('should return 400 if the payout is already processed', async () => {
    const mockLedger = { _id: 'ledger-123', paid: true }; // Already paid
    (Ledger.findById as jest.Mock).mockResolvedValue(mockLedger);

    const res = await request(app).post('/api/payouts/ledger-123/pay');
    
    expect(res.status).toBe(400);
    expect(queue.add).not.toHaveBeenCalled();
  });
});