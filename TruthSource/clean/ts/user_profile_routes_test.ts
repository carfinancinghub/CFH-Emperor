// File: userProfileRoutes.test.ts
// Path: C:\CFH\backend\controllers\__tests__\userProfileRoutes.test.ts
// Author: CFH Dev Team
// Purpose: Unit tests for userProfileRoutes controller in the CFH Marketplace
// Date: 2025-07-22T20:25:00.000Z
// Batch ID: Marketplace-072225

import request from 'supertest';
import express from 'express';
import userProfileRoutes from '@controllers/userProfileRoutes';
import { analyticsApi } from '@services/analyticsApi';
import { useTranslation } from '@i18n';
import { logError } from '@utils/logger';

// Mock dependencies
jest.mock('@services/analyticsApi');
jest.mock('@i18n');
jest.mock('@utils/logger');

const mockedAnalyticsApi = analyticsApi as jest.Mocked<typeof analyticsApi>;
const mockedUseTranslation = useTranslation as jest.Mock;
const mockedLogError = logError as jest.Mock;

describe('userProfileRoutes', () => {
  const mockT = jest.fn((key: string) => key);
  const app = express();
  app.use(express.json());
  app.use('/profiles', userProfileRoutes);

  const profileData = {
    userId: 'user-123',
    username: 'testuser',
    email: 'test@example.com',
    tier: 'Standard',
    createdAt: '2025-07-22T10:00:00.000Z',
    updatedAt: '2025-07-22T10:00:00.000Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseTranslation.mockReturnValue({ t: mockT });
  });

  // === Get User Profile Tests ===
  describe('GET /profiles/:userId', () => {
    it('should fetch user profile for Standard+ tier', async () => {
      mockedAnalyticsApi.getUserProfile.mockResolvedValue({ data: profileData });

      const response = await request(app)
        .get('/profiles/user-123')
        .set('user-tier', 'Standard');

      expect(mockedAnalyticsApi.getUserProfile).toHaveBeenCalledWith('user-123');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(profileData);
    });

    it('should return 403 for Free tier', async () => {
      const response = await request(app)
        .get('/profiles/user-123')
        .set('user-tier', 'Free');

      expect(response.status).toBe(403);
      expect(response.body).toEqual({ error: 'userProfileRoutes.error.noPermission' });
      expect(mockedLogError).toHaveBeenCalled();
    });

    it('should handle API errors', async () => {
      mockedAnalyticsApi.getUserProfile.mockRejectedValue(new Error('API Error'));

      const response = await request(app)
        .get('/profiles/user-123')
        .set('user-tier', 'Standard');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'userProfileRoutes.error.fetchFailed' });
      expect(mockedLogError).toHaveBeenCalled();
    });
  });

  // === Update User Profile Tests ===
  describe('PUT /profiles/:userId', () => {
    it('should update user profile for Premium+ tier', async () => {
      mockedAnalyticsApi.updateUserProfile.mockResolvedValue({});

      const response = await request(app)
        .put('/profiles/user-123')
        .set('user-tier', 'Premium')
        .send({ username: 'newuser', email: 'new@example.com' });

      expect(mockedAnalyticsApi.updateUserProfile).toHaveBeenCalledWith('user-123', {
        username: 'newuser',
        email: 'new@example.com',
      });
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'userProfileRoutes.success.updated' });
    });

    it('should return 403 for non-Premium tiers', async () => {
      const response = await request(app)
        .put('/profiles/user-123')
        .set('user-tier', 'Standard')
        .send({ username: 'newuser' });

      expect(response.status).toBe(403);
      expect(response.body).toEqual({ error: 'userProfileRoutes.error.noPermissionUpdate' });
      expect(mockedLogError).toHaveBeenCalled();
    });

    it('should handle update errors', async () => {
      mockedAnalyticsApi.updateUserProfile.mockRejectedValue(new Error('API Error'));

      const response = await request(app)
        .put('/profiles/user-123')
        .set('user-tier', 'Premium')
        .send({ username: 'newuser' });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'userProfileRoutes.error.updateFailed' });
      expect(mockedLogError).toHaveBeenCalled();
    });
  });

  // === TODOs and Suggestions ===
  // - Add tests for rate limiting middleware (PURCHASE-124).
  // - Test authentication token validation middleware.
  // - Add tests for PATCH method when implemented.
  // - Mock backend responses for more realistic API testing.
});