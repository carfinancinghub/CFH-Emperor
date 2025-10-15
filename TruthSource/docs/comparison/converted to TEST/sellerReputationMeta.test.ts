// File: sellerReputationMeta.test.ts
// Path: backend/routes/seller/__tests__/sellerReputationMeta.test.ts
// Purpose: Tests the secure, cached, and monetizable seller reputation API.
// Author: Mini, System Architect
// Date: August 10, 2025
// 👑 Cod1 Crown Certified — A test suite for our most advanced data endpoint.

import request from 'supertest';
import express, { Application } from 'express';
import sellerReputationRouter from '../sellerReputationMeta';

// --- Mocks ---
const mockAuthMiddleware = jest.fn();
jest.mock('@/middleware/auth', () => ({
  __esModule: true,
  default: (req: any, res: any, next: any) => mockAuthMiddleware(req, res, next),
}));

const mockRedis = { get: jest.fn(), set: jest.fn() };
jest.mock('@/services/redis', () => mockRedis);

const mockReputation = { findOne: jest.fn() };
jest.mock('@/models/system/Reputation', () => mockReputation);

const mockSellerBadgeEngine = { getReputationMeta: jest.fn() };
jest.mock('@/services/SellerBadgeEngine', () => mockSellerBadgeEngine);

jest.mock('@utils/logger', () => ({ info: jest.fn(), error: jest.fn() }));

// --- Test Setup ---
const app: Application = express();
app.use(express.json());
app.use('/api/seller', sellerReputationRouter);

describe('GET /api/seller/:id/reputation/meta', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test Case 1: Authorization Failure
  it('should return 403 Forbidden if a user requests another seller\'s data', async () => {
    mockAuthMiddleware.mockImplementation((req, res, next) => {
      req.user = { id: 'user-456', role: 'seller', plan: 'free' }; // Logged in as user-456
      next();
    });

    const res = await request(app).get('/api/seller/user-123/reputation/meta'); // Requesting for user-123
    expect(res.status).toBe(403);
  });

  // Test Case 2: Cache Hit
  it('should return data from the cache and not call the database on a cache hit', async () => {
    const cachedData = { sellerId: 'user-123', currentScore: 95 };
    mockAuthMiddleware.mockImplementation((req, res, next) => {
      req.user = { id: 'user-123', role: 'seller', plan: 'premium' };
      next();
    });
    mockRedis.get.mockResolvedValue(JSON.stringify(cachedData));

    const res = await request(app).get('/api/seller/user-123/reputation/meta');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(cachedData);
    expect(mockReputation.findOne).not.toHaveBeenCalled(); // DB was not touched
    expect(mockSellerBadgeEngine.getReputationMeta).not.toHaveBeenCalled(); // Service was not touched
  });
  
  // Test Case 3: Cache Miss (Premium User)
  it('should fetch from DB, set cache, and return premium data for a premium user on a cache miss', async () => {
    const dbData = { score: 99 };
    const metaData = { currentScore: 99, aiTips: ['Great job!'] };
    mockAuthMiddleware.mockImplementation((req, res, next) => {
      req.user = { id: 'user-123', role: 'seller', plan: 'premium' };
      next();
    });
    mockRedis.get.mockResolvedValue(null); // Cache miss
    mockReputation.findOne.mockResolvedValue(dbData);
    mockSellerBadgeEngine.getReputationMeta.mockResolvedValue(metaData);

    const res = await request(app).get('/api/seller/user-123/reputation/meta');

    expect(res.status).toBe(200);
    expect(res.body.currentScore).toBe(99);
    expect(res.body.premiumUnlocked).toEqual(['aiTips', 'ranking']); // Premium features unlocked
    expect(mockReputation.findOne).toHaveBeenCalledWith({ sellerId: 'user-123' });
    expect(mockRedis.set).toHaveBeenCalled(); // Cache was set
  });

  // Test Case 4: Cache Miss (Free User)
  it('should fetch from DB and return non-premium data for a free user', async () => {
    mockAuthMiddleware.mockImplementation((req, res, next) => {
      req.user = { id: 'user-123', role: 'seller', plan: 'free' };
      next();
    });
    mockRedis.get.mockResolvedValue(null);
    mockReputation.findOne.mockResolvedValue({ score: 80 });
    mockSellerBadgeEngine.getReputationMeta.mockResolvedValue({ currentScore: 80 });

    const res = await request(app).get('/api/seller/user-123/reputation/meta');

    expect(res.status).toBe(200);
    expect(res.body.premiumUnlocked).toEqual([]); // No premium features
  });

  // Test Case 5: 404 Not Found
  it('should return 404 if no reputation record is found', async () => {
    mockAuthMiddleware.mockImplementation((req, res, next) => {
      req.user = { id: 'user-123', role: 'seller', plan: 'free' };
      next();
    });
    mockRedis.get.mockResolvedValue(null);
    mockReputation.findOne.mockResolvedValue(null); // No data found in DB

    const res = await request(app).get('/api/seller/user-123/reputation/meta');

    expect(res.status).toBe(404);
  });
});