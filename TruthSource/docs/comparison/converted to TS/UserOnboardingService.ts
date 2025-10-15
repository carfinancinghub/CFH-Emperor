/*
 * File: UserOnboardingService.ts
 * Path: C:\CFH\backend\services\onboarding\UserOnboardingService.ts
 * Created: 2025-07-25 17:15 PDT
 * Author: Mini (AI Assistant)
 * Version: 1.0
 * Description: Service to manage the user onboarding process.
 * Artifact ID: svc-user-onboarding
 * Version ID: svc-user-onboarding-v1.0.0
 */

import logger from '@utils/logger';
// import { db } from '@services/db'; // TODO: Implement DB service

// --- Placeholder Mocks ---
const db = {
    getUser: async (userId: string) => ({ id: userId, onboarded: false, profile: {} }),
    updateUser: async (userId: string, data: any) => ({ ...data, id: userId }),
};
// --- End Mocks ---

interface ProfileData {
    name: string;
    email: string;
    phone: string;
}

export class UserOnboardingService {
  /**
   * Completes the profile for a new user.
   * @param userId The ID of the user.
   * @param profileData The required profile information.
   * @returns A status object.
   */
  static async completeProfile(userId: string, profileData: ProfileData): Promise<{ status: string }> {
    try {
      const user = await db.getUser(userId);
      if (!user) {
        throw new Error('User not found'); // TODO: Use custom NotFoundError
      }

      const requiredFields: (keyof ProfileData)[] = ['name', 'email', 'phone'];
      const missingFields = requiredFields.filter(field => !profileData[field]);
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`); // TODO: Use custom ValidationError
      }

      await db.updateUser(userId, { profile: profileData, onboarded: true });
      logger.info(`[UserOnboarding] Completed profile for userId: ${userId}`);
      return { status: 'profile_completed' };
    } catch (err) {
      logger.error(`[UserOnboarding] Failed to complete profile for userId ${userId}: ${(err as Error).message}`, err);
      throw err;
    }
  }

  /**
   * Retrieves the current onboarding status for a user.
   * @param userId The ID of the user.
   * @returns The user's onboarding status and profile.
   */
  static async getOnboardingStatus(userId: string): Promise<{ onboarded: boolean; profile: Partial<ProfileData> }> {
    try {
      const user = await db.getUser(userId);
      if (!user) {
        throw new Error('User not found');
      }

      logger.info(`[UserOnboarding] Retrieved onboarding status for userId: ${userId}`);
      return { onboarded: user.onboarded || false, profile: user.profile || {} };
    } catch (err) {
      logger.error(`[UserOnboarding] Failed to get onboarding status for userId ${userId}: ${(err as Error).message}`, err);
      throw err;
    }
  }
}
