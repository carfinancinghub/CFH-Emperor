// File: SocialGamification.ts
// Path: backend/services/premium/SocialGamification.ts
// Purpose: A comprehensive service for all social gamification features.
// Author: Mini, System Architect
// Date: August 10, 2025
// 👑 Cod1 Crown Certified — Scalable, Extensible, and Resilient by Design.

// TODO:
// @free:
//   - [ ] Implement the actual Mongoose models for User, Vehicle, Mission, etc.
//   - [ ] Establish a real connection to a Redis instance in the `redisClient` utility.
//   - [ ] Build the admin UI for creating and managing the dynamic missions stored in the database.
// @premium:
//   - [ ] ✨ Create a user-facing "Mission Control" dashboard where users can see active challenges and track their progress.
//   - [ ] ✨ Add webhooks to this service that can notify external systems (e.g., a marketing platform) when a user earns a significant badge.
// @wow:
//   - [ ] 🚀 Develop a "dynamic difficulty" system where mission conditions adjust based on a user's skill level to keep them engaged.

import logger from '@/utils/logger';
import db from '@/services/db'; // Placeholder for your database service
import redis from '@/services/redis'; // Placeholder for your Redis client

// --- Type Definitions (to be defined in a dedicated types file) ---
interface IUser { _id: string; isPremium: boolean; role: 'user' | 'officer'; }
interface IVehicle { _id: string; }
interface IBadge { type: string; awardedAt: string; }
interface IMission { name: string; condition: (data: any) => boolean; badge: string; }
interface IActionData {
  usedPredictiveAssistant?: boolean;
  wonAuction?: boolean;
  bidPlacedWithinFirstMinute?: boolean;
  predictionAccuracy?: number;
}

// --- Service Module ---
const SocialGamification = {

  /**
   * Creates a simulated VR tour of a vehicle for a premium user.
   */
  async createVRTour(userId: string, vehicleId: string): Promise<{ tourId: string; vrTourUrl: string }> {
    try {
      const user: IUser | null = await db.getUser(userId);
      if (!user || !user.isPremium) throw new Error('Premium access required');
      
      const vehicle: IVehicle | null = await db.getVehicle(vehicleId);
      if (!vehicle) throw new Error('Vehicle not found');

      const tour = { id: `vr-tour-${vehicleId}`, url: `vr://tour-${vehicleId}` }; // Simulated
      logger.info(`[SocialGamification] Created VR tour for userId: ${userId}, vehicleId: ${vehicleId}`);
      return { tourId: tour.id, vrTourUrl: tour.url };
    } catch (err) {
      const error = err as Error;
      logger.error(`[SocialGamification] Failed to create VR tour for userId ${userId}: ${error.message}`, error);
      throw error;
    }
  },

  /**
   * Assigns a specific badge to a premium user.
   */
  async assignBadge(userId: string, badgeType: string): Promise<{ badge: IBadge; status: 'assigned' }> {
    try {
      const user: IUser | null = await db.getUser(userId);
      if (!user || !user.isPremium) throw new Error('Premium access required');

      const badge = { type: badgeType, awardedAt: new Date().toISOString() };
      await db.addBadge(userId, badge);
      logger.info(`[SocialGamification] Assigned badge ${badgeType} to userId: ${userId}`);
      return { badge, status: 'assigned' };
    } catch (err) {
      const error = err as Error;
      logger.error(`[SocialGamification] Failed to assign badge for userId ${userId}: ${error.message}`, error);
      throw error;
    }
  },

  /**
   * Checks if a user has completed a challenge mission based on dynamic, database-driven rules.
   */
  async completeChallengeMission(userId: string, missionType: string, actionData: IActionData): Promise<{ mission: string; badge?: string; status: 'completed' | 'not_completed' }> {
    try {
      const user: IUser | null = await db.getUser(userId);
      if (!user || !user.isPremium) throw new Error('Premium access required');

      // ARCHITECTURAL UPGRADE: Mission logic is now fetched from the database, not hardcoded.
      const mission: IMission | null = await db.getMissionByType(missionType);
      if (!mission) throw new Error('Invalid mission type');

      if (mission.condition(actionData)) {
        await this.assignBadge(userId, mission.badge);
        logger.info(`[SocialGamification] Completed mission ${missionType} for userId: ${userId}`);
        return { mission: missionType, badge: mission.badge, status: 'completed' };
      }

      return { mission: missionType, status: 'not_completed' };
    } catch (err) {
      const error = err as Error;
      logger.error(`[SocialGamification] Failed to complete mission for userId ${userId}: ${error.message}`, error);
      throw error;
    }
  },
  
  /**
   * Allows an officer to moderate a piece of content.
   */
  async moderateContent(officerId: string, contentId: string, action: 'approve' | 'reject'): Promise<{ contentId: string; action: string; status: 'moderated' }> {
    try {
      const officer: IUser | null = await db.getUser(officerId);
      if (!officer || officer.role !== 'officer') throw new Error('Officer access required');

      await db.updateContent(contentId, { moderationStatus: action, moderatedBy: officerId });
      logger.info(`[SocialGamification] Moderated ${contentId} by officerId: ${officerId} with action: ${action}`);
      return { contentId, action, status: 'moderated' };
    } catch (err) {
      const error = err as Error;
      logger.error(`[SocialGamification] Failed to moderate content for officerId ${officerId}: ${error.message}`, error);
      throw error;
    }
  },

  /**
   * Allows a user to flag content, with automated review triggers.
   */
  async flagContent(userId: string, contentId: string): Promise<{ status: 'flagged' | 'review_triggered' }> {
    const FLAG_THRESHOLD = 3; // Trigger review after 3 flags
    try {
        const flagCount = await db.addFlagToContent(userId, contentId);

        if (flagCount >= FLAG_THRESHOLD) {
            await db.updateContent(contentId, { moderationStatus: 'pending_review' });
            // TODO: Add a notification to a message queue for all officers.
            logger.info(`[SocialGamification] Content ${contentId} automatically flagged for review.`);
            return { status: 'review_triggered' };
        }
        
        logger.info(`[SocialGamification] Content ${contentId} flagged by user ${userId}.`);
        return { status: 'flagged' };
    } catch(err) {
        // Handle cases where user already flagged this content etc.
        const error = err as Error;
        logger.error(`[SocialGamification] Failed to flag content ${contentId} by user ${userId}: ${error.message}`, error);
        throw error;
    }
  },

  /**
   * Performs high-performance rate limiting for an action using Redis.
   */
  async rateLimitSocialAction(userId: string, actionType: 'mission_submission' | 'leaderboard_entry'): Promise<{ status: 'allowed' | 'denied' }> {
    // ARCHITECTURAL UPGRADE: Using Redis for fast, scalable rate limiting.
    const limits = {
        mission_submission: { limit: 5, window: 3600 }, // 5 submissions per hour
        leaderboard_entry: { limit: 10, window: 3600 }  // 10 entries per hour
    };
    const config = limits[actionType];
    const key = `rate-limit:${userId}:${actionType}`;

    try {
      const currentCount = await redis.incr(key);

      if (currentCount === 1) {
        // If it's the first action in the window, set the expiration.
        await redis.expire(key, config.window);
      }

      if (currentCount > config.limit) {
        logger.warn(`[SocialGamification] Rate limit exceeded for userId: ${userId}, actionType: ${actionType}`);
        return { status: 'denied' };
      }

      logger.info(`[SocialGamification] Allowed action ${actionType} for userId: ${userId}. Count: ${currentCount}`);
      return { status: 'allowed' };
    } catch (err) {
      const error = err as Error;
      logger.error(`[SocialGamification] Redis rate limit failed for userId ${userId}: ${error.message}`, error);
      throw error;
    }
  }
};

export default SocialGamification;