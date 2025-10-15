// File: syncRoutes.test.ts
// Path: backend/routes/escrow/__tests__/syncRoutes.test.ts
// Purpose: Tests the high-security escrow and blockchain sync API routes.

import request from 'supertest';
import express, { Application } from 'express';
import syncRouter from '../syncRoutes'; // The router we are testing

// --- Mocks ---
// Mock the service layer to isolate the router's logic
const mockEscrowChainSync = {
  syncToBlockchain: jest.fn(),
  syncEscrowAction: jest.fn(),
  getEscrowStatus: jest.fn(),
  getBlockchainAuditTrail: jest.fn(),
};
jest.mock('@services/escrow/EscrowChainSync', () => mockEscrowChainSync);

// Mock middleware
jest.mock('@utils/logger', () => ({ error: jest.fn(), info: jest.fn() }));
jest.mock('helmet', () => () => (req: any, res: any, next: any) => next());
jest.mock('express-rate-limit', () => () => (req: any, res: any, next: any) => next());
jest.mock('@/middleware/auth', () => ({
  __esModule: true,
  default: (req: any, res: any, next: any) => {
    req.user = { id: 'test-user-id' };
    next();
  },
}));

// --- Test Setup ---
const app: Application = express();
app.use(express.json());
app.use('/api/escrow', syncRouter);

describe('Escrow Sync API Routes', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/escrow/sync', () => {
    it('should call syncToBlockchain when isPremium is true', async () => {
      mockEscrowChainSync.syncToBlockchain.mockResolvedValue({ txHash: '0x123' });
      const body = { actionData: { amount: 100 }, isPremium: true };

      const res = await request(app).post('/api/escrow/sync').send(body);

      expect(res.status).toBe(200);
      expect(mockEscrowChainSync.syncToBlockchain).toHaveBeenCalledWith(body.actionData);
      expect(mockEscrowChainSync.syncEscrowAction).not.toHaveBeenCalled();
      expect(res.body.data).toEqual({ txHash: '0x123' });
    });

    it('should call syncEscrowAction when isPremium is false', async () => {
      mockEscrowChainSync.syncEscrowAction.mockResolvedValue({ dbId: 'db123' });
      const body = { actionData: { amount: 50 }, isPremium: false };

      const res = await request(app).post('/api/escrow/sync').send(body);

      expect(res.status).toBe(200);
      expect(mockEscrowChainSync.syncEscrowAction).toHaveBeenCalledWith(body.actionData);
      expect(mockEscrowChainSync.syncToBlockchain).not.toHaveBeenCalled();
      expect(res.body.data).toEqual({ dbId: 'db123' });
    });
  });

  describe('GET /api/escrow/status/:transactionId', () => {
    it('should get both status and audit trail if isPremium is true', async () => {
        mockEscrowChainSync.getEscrowStatus.mockResolvedValue({ status: 'confirmed' });
        mockEscrowChainSync.getBlockchainAuditTrail.mockResolvedValue(['log1', 'log2']);
        
        const res = await request(app).get('/api/escrow/status/tx123?isPremium=true');

        expect(res.status).toBe(200);
        expect(mockEscrowChainSync.getEscrowStatus).toHaveBeenCalledWith('tx123');
        expect(mockEscrowChainSync.getBlockchainAuditTrail).toHaveBeenCalledWith('tx123');
        expect(res.body.data.auditTrail).toEqual(['log1', 'log2']);
    });
    
    it('should get only status if isPremium is false or not provided', async () => {
        mockEscrowChainSync.getEscrowStatus.mockResolvedValue({ status: 'pending' });

        const res = await request(app).get('/api/escrow/status/tx456');

        expect(res.status).toBe(200);
        expect(mockEscrowChainSync.getEscrowStatus).toHaveBeenCalledWith('tx456');
        expect(mockEscrowChainSync.getBlockchainAuditTrail).not.toHaveBeenCalled();
        expect(res.body.data.auditTrail).toBeNull();
    });
  });
});