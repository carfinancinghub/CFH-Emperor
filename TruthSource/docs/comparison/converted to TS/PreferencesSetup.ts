// ----------------------------------------------------------------------
// File: PreferencesSetup.ts
// Path: backend/src/services/onboarding/PreferencesSetup.ts
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// A robust service for setting and retrieving user preferences, featuring
// declarative validation and a decoupled configuration.
//
// @usage
// Called by API routes during user onboarding or from a user's settings page.
// `PreferencesSetup.setPreferences(userId, newPreferences)`
//
// @architectural_notes
// - **Declarative Validation with Zod**: We use a Zod schema to define the
//   exact shape and types of the preferences object. This replaces manual,
//   imperative checks and is our new standard for all complex data validation.
// - **Decoupled & Extensible Configuration**: The list of allowed preference
//   fields is defined in a separate config object. To add a new preference to
//   the system, a developer only needs to update the config and the Zod schema.
//
// ----------------------------------------------------------------------

// --- FUTURE ENHANCEMENTS (TODO) ---
// @free:
//   - [ ] Move the `userPreferenceConfig` and `PreferencesSchema` to a central '/config' or '/schemas' directory.
// @premium:
//   - [ ] ✨ Allow premium users to save multiple, named preference profiles (e.g., "Weekend Searches", "Commuter Cars").
// @wow:
//   - [ ] 🚀 Use a user's preferences to automatically generate a personalized "Daily Digest" of new listings that perfectly match their criteria.

import { z } from 'zod';
import logger from '@/utils/logger';
import db from '@/services/db';
import { IUser } from '@/types';

// --- ARCHITECTURAL UPGRADE: Decoupled & Extensible Configuration ---
const userPreferenceConfig = {
  allowedFields: ['currency', 'vehicleType', 'priceRange', 'location'],
};

// --- ARCHITECTURAL UPGRADE: Declarative Validation with Zod ---
const PreferencesSchema = z.object({
  currency: z.string().length(3).optional(),
  vehicleType: z.enum(['all', 'sedan', 'suv', 'truck']).optional(),
  priceRange: z.object({
    min: z.number().min(0),
    max: z.number().positive(),
  }).optional(),
  location: z.string().optional(),
}).strict(); // .strict() ensures no extra fields are allowed

// Infer the TypeScript type directly from the Zod schema
type IUserPreferences = z.infer<typeof PreferencesSchema>;

// --- Service Module ---
const PreferencesSetup = {
  /**
   * Sets (updates) a user's preferences after validating against the schema.
   */
  async setPreferences(userId: string, preferences: IUserPreferences): Promise<{ status: 'preferences_set' }> {
    try {
      const user = await db.getUser(userId) as IUser;
      if (!user) throw new Error('User not found');

      // Validate the incoming data against our schema. This is powerful and declarative.
      const validatedPreferences = PreferencesSchema.parse(preferences);

      await db.updateUser(userId, { preferences: validatedPreferences });
      logger.info(`[PreferencesSetup] Set preferences for userId: ${userId}`);
      return { status: 'preferences_set' };
    } catch (err) {
      const error = err as Error;
      if (err instanceof z.ZodError) {
        logger.error(`[PreferencesSetup] Invalid preference schema for userId ${userId}:`, err.errors);
        throw new Error('Invalid preference data provided.');
      }
      logger.error(`[PreferencesSetup] Failed to set preferences for userId ${userId}: ${error.message}`, error);
      throw error;
    }
  },

  /**
   * Retrieves a default set of preferences.
   */
  async getDefaultPreferences(): Promise<IUserPreferences> {
    // In a real app, these defaults could also come from a config file.
    return {
      currency: 'USD',
      vehicleType: 'all',
      priceRange: { min: 0, max: 100000 },
      location: 'all',
    };
  },
};

export default PreferencesSetup;