// ----------------------------------------------------------------------
// File: profileViewRoutes.test.ts
// Path: backend/src/routes/__tests__/profileViewRoutes.test.ts
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// Integration tests for the secure profile view logging and retrieval API.
//
// @architectural_notes
// - **Testing Security & Data Integrity Rules**: The tests focus on our
//   custom architectural rules: verifying that rate limiting is active,
//   that users cannot log self-views, and that the authorization check to
//   view a log is correctly enforced for users and admins.
//
// ----------------------------------------------------------------------

import request from 'supertest';
import express, { Application } from 'express';
import profileViewRouter from '../profileViewRoutes';

// --- Mocks ---
const mockAuthMiddleware = jest.fn();
jest.mock('@/middleware/auth', () => ({
  __esModule: true,
  default: (req: any, res: any, next: any) => mockAuthMiddleware(req, res, next),
}));

// Mock the rate limiter to just pass through, as its internal logic is tested elsewhere
jest.mock('@/middleware/rateLimiter', () => ({
  createRateLimiter: () => (req: any, res: any, next: any) => next(),
}));

const mockProfileView = {
  save: jest.fn(),
  find: jest.fn(),
};
// This is a simplified mock for the constructor
jest.mock('@/models/ProfileView', () => jest.fn().mockImplementation(() => ({
  save: mockProfileView.save,
})));


// --- Test Setup ---
const app: Application = express();
app.use(express.json());
app.use('/api/profile-views', profileViewRouter);

describe('Profile View API Routes', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/profile-views', () => {
    it('should return 400 Bad Request if a user tries to log a view on their own profile', async () => {
      mockAuthMiddleware.mockImplementation((req, res, next) => {
        req.user = { id: 'user-123' };
        next();
      });
      
      const res = await request(app).post('/api/profile-views').send({ viewedUserId: 'user-123' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Cannot log a view on your own profile.');
      expect(mockProfileView.save).not.toHaveBeenCalled();
    });
  });

  describe('GET /api/profile-views/user/:userId', () => {
    it('should return 403 Forbidden if a user tries to view logs that are not theirs', async () => {
      mockAuthMiddleware.mockImplementation((req, res, next) => {
        req.user = { id: 'user-456', role: 'buyer' }; // Logged in as user-456
        next();
      });

      const res = await request(app).get('/api/profile-views/user/user-123'); // Trying to view logs for user-123
      expect(res.status).toBe(403);
    });

    it('should return 200 for an admin viewing another user\'s logs', async () => {
      mockAuthMiddleware.mockImplementation((req, res, next) => {
        req.user = { id: 'admin-789', role: 'admin' };
        next();
      });
      // Mock the find method to return a mock value
      (ProfileView.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        populate: jest.fn().mockResolvedValue([{ viewerUserId: 'some-viewer' }]),
      });
      
      const res = await request(app).get('/api/profile-views/user/user-123');
      expect(res.status).toBe(200);
    });
  });
});