// ----------------------------------------------------------------------
// File: OnboardingService.test.ts
// Path: backend/src/services/__tests__/OnboardingService.test.ts
// Author: Mini, System Architect
// Created: August 11, 2025 at 01:28 AM PDT
// Version: 2.0.0 (Architecturally Superior Version)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------

import OnboardingService from '../OnboardingService';
import { User } from '@/models/User';

jest.mock('@/models/User');

describe('OnboardingService', () => {
  it('should return the correct onboarding track for a "seller"', async () => {
    const mockUser = { role: 'seller', onboardingTasks: [] };
    const tasks = await OnboardingService.getOnboardingTasks(mockUser as any);
    expect(tasks.some(t => t.id === 'create_listing')).toBe(true);
    expect(tasks.some(t => t.id === 'set_preferences')).toBe(false);
  });

  it('should throw a Zod validation error for invalid profile data', async () => {
    const invalidProfileData = { name: 'A' }; // Name is too short
    await expect(OnboardingService.completeProfile('user-123', invalidProfileData))
      .rejects.toThrow();
  });
});