// ----------------------------------------------------------------------
// File: ReputationEngine.ts
// Path: backend/services/ReputationEngine.ts
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// A centralized service for managing and auditing user reputation scores.
//
// @usage
// Import and call `ReputationEngine.adjustReputation()` from other services
// or routes where a user action has a reputational impact.
// e.g., `ReputationEngine.adjustReputation(userId, 'win_case')`
//
// @architectural_notes
// - **Decoupled Rules**: The reputation impact scores are defined in a separate
//   config object, not hardcoded in the logic. This allows for easy tuning.
// - **Full Audit Trail**: Every reputation change is logged to a separate
//   database collection ('ReputationLog'). This is a non-negotiable standard
//   for accountability and transparency.
// - **Type-Safe Actions**: The 'ReputationAction' type ensures that only valid,
//   pre-defined actions can be passed to the function, preventing typos.
//
// ----------------------------------------------------------------------

// --- FUTURE ENHANCEMENTS (TODO) ---
// @free:
//   - [ ] Move the `reputationRules` config to its own file in `/src/config`.
//   - [ ] Implement the `ReputationLog` Mongoose model.
// @premium:
//   - [ ] ✨ Create a function `getReputationHistory(userId)` that returns the full audit log for a user's score changes.


import User from '@/models/User';
import logger from '@/utils/logger';
import db from '@/services/db'; // Placeholder for DB service with logReputationEvent

// --- ARCHITECTURAL UPGRADE: Decoupled Reputation Rules ---
const reputationRules = {
  win_case: 10,
  lose_case: -15,
  on_time: 5,
  late: -5,
  reported: -10,
  positive_feedback: 7,
  negative_feedback: -7,
};

// --- Type Definitions ---
export type ReputationAction = keyof typeof reputationRules;

// --- Service Module ---
const ReputationEngine = {
  /**
   * Adjusts a user's reputation and creates an audit log entry.
   * @param userId ID of the user to update.
   * @param action The type of action performed.
   * @returns The user's new reputation score.
   */
  async adjustReputation(userId: string, action: ReputationAction): Promise<number> {
    const delta = reputationRules[action] || 0;

    try {
      const user = await User.findById(userId);
      if (!user) throw new Error(`User not found with ID: ${userId}`);

      const oldReputation = user.reputation || 0;
      user.reputation = oldReputation + delta;
      await user.save();
      
      // ARCHITECTURAL UPGRADE: Create a Full Audit Trail
      await db.logReputationEvent({
        userId,
        action,
        delta,
        oldReputation,
        newReputation: user.reputation,
        timestamp: new Date(),
      });

      logger.info(`📊 Updated reputation for ${user.email || userId}: ${delta >= 0 ? '+' : ''}${delta}. New score: ${user.reputation}`);
      return user.reputation;
    } catch (err) {
      const error = err as Error;
      logger.error(`❌ Failed to update reputation for user ${userId}: ${error.message}`, error);
      throw error; // Re-throw the error for the caller to handle
    }
  },
};

export default ReputationEngine;