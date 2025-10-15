// File: sellerRoutes.test.ts
// Path: backend/routes/seller/__tests__/sellerRoutes.test.ts
// Purpose: Tests the secure, multi-layered seller API endpoints.

import request from 'supertest';
import express, { Application } from 'express';
import sellerRouter from '../sellerRoutes';

// --- Mocks ---
const mockAuthMiddleware = jest.fn();
jest.mock('@/middleware/auth', () => ({ // Assuming this is the correct path for your auth middleware
  __esModule: true,
  default: (req: any, res: any, next: any) => mockAuthMiddleware(req, res, next),
}));

const mockReputation = { findOne: jest.fn() };
jest.mock('@/models/system/Reputation', () => mockReputation);

const mockSellerBadgeEngine = {
  calculateProgress: jest.fn(),
  generateAiTips: jest.fn(),
  getRanking: jest.fn(),
  generateReputationCoachPlan: jest.fn(),
  generateVisualTimelineSteps: jest.fn(),
};
jest.mock('@/services/SellerBadgeEngine', () => mockSellerBadgeEngine); // Assuming service path

jest.mock('@utils/logger', () => ({ error: jest.fn() }));

// --- Test Setup ---
const app: Application = express();
app.use(express.json());
app.use('/api/seller', sellerRouter);

describe('Seller API Routes', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /:id/reputation/meta', () => {
    it('should return 403 Forbidden if a user tries to access another seller\'s data', async () => {
      mockAuthMiddleware.mockImplementation((req, res, next) => {
        req.user = { id: 'seller-456', role: 'seller' }; // Logged in as seller-456
        next();
      });

      const res = await request(app).get('/api/seller/seller-123/reputation/meta'); // Trying to access seller-123

      expect(res.status).toBe(403);
      expect(res.body.message).toContain('Forbidden');
    });

    it('should return 200 for an admin accessing any seller\'s data', async () => {
      mockAuthMiddleware.mockImplementation((req, res, next) => {
        req.user = { id: 'admin-789', role: 'admin' };
        next();
      });
      mockReputation.findOne.mockResolvedValue({ score: 100 });
      mockSellerBadgeEngine.getRanking.mockResolvedValue(1);

      const res = await request(app).get('/api/seller/seller-123/reputation/meta');
      
      expect(res.status).toBe(200);
      expect(res.body.ranking).toBe(1);
    });
  });

  describe('GET /:id/coach-plan', () => {
    it('should return 403 Forbidden for a non-premium user', async () => {
      mockAuthMiddleware.mockImplementation((req, res, next) => {
        // User is authorized to see their own data, but does not have the premium feature
        req.user = { id: 'seller-123', role: 'seller', features: [] }; 
        next();
      });

      const res = await request(app).get('/api/seller/seller-123/coach-plan');

      expect(res.status).toBe(403);
      expect(res.body.message).toContain('premium feature');
    });

    it('should return 200 for a premium user accessing their own coach plan', async () => {
      mockAuthMiddleware.mockImplementation((req, res, next) => {
        req.user = { id: 'seller-123', role: 'seller', features: ['aiCoach'] };
        next();
      });
      mockReputation.findOne.mockResolvedValue({ score: 100 });
      mockSellerBadgeEngine.generateReputationCoachPlan.mockResolvedValue({ recommendation: 'Sell more cars.' });

      const res = await request(app).get('/api/seller/seller-123/coach-plan');

      expect(res.status).toBe(200);
      expect(res.body.coachPlan.recommendation).toBe('Sell more cars.');
    });
  });
});