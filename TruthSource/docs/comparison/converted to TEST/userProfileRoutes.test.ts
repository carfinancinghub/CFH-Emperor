/*
 * File: userProfileRoutes.test.ts
 * Path: C:\CFH\backend\tests\routes\user\userProfileRoutes.test.ts
 * Created: 2025-07-25 17:15 PDT
 * Author: Mini (AI Assistant)
 * Version: 1.0
 * Description: Jest tests for the user profile API routes.
 * Artifact ID: test-route-user-profile
 * Version ID: test-route-user-profile-v1.0.0
 */

import request from 'supertest';
import express from 'express';
import userProfileRoutes from '@routes/user/userProfileRoutes';
import { UserProfileService } from '@services/user/UserProfileService';

// Mock dependencies
jest.mock('@utils/logger');
jest.mock('@services/user/UserProfileService');
jest.mock('@middleware/authMiddleware', () => ({
  authenticateToken: (req: any, res: any, next: any) => {
    req.user = { id: 'testUserId' };
    next();
  },
}));

const app = express();
app.use(express.json());
app.use('/api/user', userProfileRoutes);

describe('User Profile API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET /profile - should fetch a user profile successfully', async () => {
    (UserProfileService.getUserProfile as jest.Mock).mockResolvedValue({ username: 'test', email: 'test@cfh.com' });
    const res = await request(app).get('/api/user/profile');
    expect(res.statusCode).toBe(200);
    expect(res.body.username).toBe('test');
  });

  it('PUT /profile - should update a user profile successfully', async () => {
    const updates = { username: 'newname' };
    (UserProfileService.updateUserProfile as jest.Mock).mockResolvedValue({ username: 'newname', email: 'test@cfh.com' });
    const res = await request(app).put('/api/user/profile').send(updates);
    expect(res.statusCode).toBe(200);
    expect(res.body.username).toBe('newname');
    expect(UserProfileService.updateUserProfile).toHaveBeenCalledWith('testUserId', updates);
  });
});
