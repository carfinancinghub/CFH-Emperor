// ----------------------------------------------------------------------
// File: userProfileService.ts
// Path: backend/src/services/user/userProfileService.ts
// Author: Mini, System Architect
// Created: August 11, 2025 at 06:44 AM PDT
// Version: 2.0.0 (Architecturally Superior Version)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// A unified service for managing user profiles and preferences, with robust
// validation and a clean, maintainable structure.
//
// @architectural_notes
// - **Consolidated Logic**: Merges logic from older profile and preference
//   services into one cohesive module.
// - **Declarative Validation (Zod)**: Uses Zod for robust, declarative validation
//   of incoming profile data, a non-negotiable standard for data integrity.
//
// @todos
// - @free:
//   - [ ] Add a function for users to retrieve their own review history.
// - @premium:
//   - [ ] ✨ Implement a feature for users to upload and manage a profile avatar image.
// - @wow:
//   - [ ] 🚀 Develop a "Profile Strength" indicator that uses an AI to analyze the completeness and quality of a user's profile and suggests improvements.
//
// ----------------------------------------------------------------------

import { z } from 'zod';
import { User } from '@/models/User';
import { IUser } from '@/types';
import logger from '@/utils/logger';

// --- Zod Schemas for Validation ---
const ProfileUpdateSchema = z.object({
  username: z.string().min(3).optional(),
  email: z.string().email().optional(),
}).strict();

type ProfileUpdateData = z.infer<typeof ProfileUpdateSchema>;

// --- Service Module ---
const userProfileService = {
  async getUserProfile(userId: string) {
    const user = await User.findById(userId).select('-password');
    if (!user) throw new Error('User not found');
    return user;
  },

  async updateUserProfile(userId: string, updates: ProfileUpdateData): Promise<IUser> {
    const validatedUpdates = ProfileUpdateSchema.parse(updates);
    const updatedUser = await User.findByIdAndUpdate(userId, { $set: validatedUpdates }, { new: true });
    if (!updatedUser) throw new Error('User not found');
    logger.info(`Profile updated for user ${userId}`);
    return updatedUser;
  },
};

export default userProfileService;