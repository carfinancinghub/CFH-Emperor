// ----------------------------------------------------------------------
// File: GamificationService.ts
// Path: backend/services/GamificationService.ts
// Author: Gemini, System Architect
// Created: August 11, 2025 at 19:17 PDT
// Version: 2.0.0 (Optimized & Refactored)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// The definitive, optimized service for all gamification and social features.
//
// @architectural_notes
// - **Optimized Badge Awarding**: The badge checking logic has been refactored
//   to be highly performant. It now only checks for badges relevant to the
//   specific event that occurred, reducing unnecessary database queries.
// - **Decoupled Configuration**: All points and badge rules are now loaded
//   from a dedicated config file, making the system easier to manage and extend.
//
// @todos
// - @premium:
//   - [ ] ✨ Implement the Leaderboard generation logic.
// - @wow:
//   - [ ] 🚀 Build the AI-powered service for generating dynamic, personalized "Quests".
//
// ----------------------------------------------------------------------

import User from '@/models/User';
import ActivityEvent from '@/models/ActivityEvent';
import UserBadge from '@/models/UserBadge';
import { POINTS_MAP, BADGES } from '@/config/gamification.config';

const GamificationService = {
  /**
   * The main entry point for all gamified actions.
   */
  async logEvent(userId: string, eventType: keyof typeof POINTS_MAP) {
    // Step 1: Log the activity event for auditing and history
    const points = POINTS_MAP[eventType] || 0;
    await ActivityEvent.create({ user: userId, eventType, pointsAwarded: points });

    // Step 2: Award points to the user
    await User.findByIdAndUpdate(userId, { $inc: { 'gamification.points': points } });

    // Step 3: Efficiently check only for badges related to this event
    await this._checkAndAwardBadges(userId, eventType);
  },

  /**
   * Checks if a user has earned any badges related to a specific event.
   */
  async _checkAndAwardBadges(userId: string, eventType: string) {
    const relevantBadges = Object.entries(BADGES).filter(
      ([key, badge]) => badge.criteria.event === eventType
    );

    if (relevantBadges.length === 0) return;

    // Get the user's existing badges
    const userBadges = await UserBadge.find({ user: userId }).select('badgeKey');
    const userBadgeKeys = userBadges.map(b => b.badgeKey);

    for (const [key, badge] of relevantBadges) {
      // Skip if user already has this badge
      if (userBadgeKeys.includes(key)) continue;

      // Check if user meets the criteria
      const eventCount = await ActivityEvent.countDocuments({
        user: userId,
        eventType: badge.criteria.event,
      });

      if (eventCount >= badge.criteria.count) {
        // Award the new badge
        await UserBadge.create({ user: userId, badgeKey: key, badgeName: badge.name });
        console.log(`AWARDED BADGE: ${badge.name} to user ${userId}`);
        // Here we would also send a notification to the user
      }
    }
  },
};

export default GamificationService;