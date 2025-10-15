/*
 * File: UserOnboardingService.test.ts
 * Path: C:\CFH\backend\tests\services\onboarding\UserOnboardingService.test.ts
 * Created: 2025-07-25 17:15 PDT
 * Author: Mini (AI Assistant)
 * Version: 1.0
 * Description: Jest tests for the UserOnboardingService.
 * Artifact ID: test-svc-user-onboarding
 * Version ID: test-svc-user-onboarding-v1.0.0
 */

import { UserOnboardingService } from '@services/onboarding/UserOnboardingService';

jest.mock('@utils/logger');
jest.mock('@services/db', () => ({
  getUser: jest.fn(),
  updateUser: jest.fn(),
}));

describe('UserOnboardingService', () => {
  const db = require('@services/db');

  beforeEach(() => jest.clearAllMocks());

  describe('completeProfile', () => {
    it('should successfully complete a user profile with valid data', async () => {
      db.getUser.mockResolvedValue({ id: 'user123' });
      const profileData = { name: 'Jane Doe', email: 'jane@test.com', phone: '1234567890' };
      const result = await UserOnboardingService.completeProfile('user123', profileData);
      
      expect(result.status).toBe('profile_completed');
      expect(db.updateUser).toHaveBeenCalledWith('user123', { profile: profileData, onboarded: true });
    });

    it('should throw an error if required fields are missing', async () => {
      db.getUser.mockResolvedValue({ id: 'user123' });
      const incompleteData = { name: 'Jane Doe', email: 'jane@test.com' } as any;
      await expect(UserOnboardingService.completeProfile('user123', incompleteData)).rejects.toThrow('Missing required fields: phone');
    });
  });
});
