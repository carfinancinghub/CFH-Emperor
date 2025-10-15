// ----------------------------------------------------------------------
// File: userProfileService.test.ts
// Path: backend/src/services/user/__tests__/userProfileService.test.ts
// Author: Mini, System Architect
// Created: August 11, 2025 at 06:44 AM PDT
// Version: 2.0.0 (Architecturally Superior Version)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------

import userProfileService from '../userProfileService';
import { User } from '@/models/User';

jest.mock('@/models/User');

describe('userProfileService', () => {
  it('should throw a validation error if profile update data is invalid', async () => {
    const invalidUpdate = { username: 'a' }; // Too short
    await expect(userProfileService.updateUserProfile('user-123', invalidUpdate)).rejects.toThrow();
  });
});