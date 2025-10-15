// ----------------------------------------------------------------------
// File: rateLimiter.test.ts
// Path: backend/src/middleware/__tests__/rateLimiter.test.ts
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// Integration tests for the high-performance, configurable rate limiter middleware.
//
// ----------------------------------------------------------------------

import request from 'supertest';
import express, { Application } from 'express';
import { createRateLimiter } from '../rateLimiter';
import redis from '@/services/redis';

// --- Mocks ---
jest.mock('@/services/redis', () => ({
  incr: jest.fn(),
  expire: jest.fn(),
  ttl: jest.fn().mockResolvedValue(60), // Mock TTL for headers
}));

// --- Test Setup ---
const app: Application = express();
app.use(express.json());

// Apply middleware to a test route
app.get(
  '/limited-by-user',
  (req: any, res, next) => { req.user = { id: 'user-123' }; next(); }, // Mock auth
  createRateLimiter({ action: 'test_user', limit: 2, window: 60 }),
  (req, res) => res.status(200).json({ message: 'Success' })
);
app.get(
  '/limited-by-ip',
  createRateLimiter({ action: 'test_ip', limit: 2, window: 60 }),
  (req, res) => res.status(200).json({ message: 'Success' })
);


describe('Rate Limiter Middleware', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should allow requests under the limit for an authenticated user', async () => {
    (redis.incr as jest.Mock).mockResolvedValue(1);
    const res = await request(app).get('/limited-by-user');
    expect(res.status).toBe(200);
    expect(res.header['x-ratelimit-remaining']).toBe('1');
  });

  it('should block requests over the limit and return a 429 status', async () => {
    (redis.incr as jest.Mock).mockResolvedValue(3); // Limit is 2
    const res = await request(app).get('/limited-by-user');
    expect(res.status).toBe(429);
    expect(res.body.message).toContain('Too many requests');
  });

  it('should use the IP address as an identifier for unauthenticated routes', async () => {
    (redis.incr as jest.Mock).mockResolvedValue(1);
    await request(app).get('/limited-by-ip');
    
    // The key should contain the user's IP address (default is '::ffff:127.0.0.1')
    expect(redis.incr).toHaveBeenCalledWith(expect.stringContaining('ip:::ffff:127.0.0.1'));
  });
});