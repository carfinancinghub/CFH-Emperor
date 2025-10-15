// ----------------------------------------------------------------------
// File: User.ts
// Path: backend/src/models/User.ts
// Author: Mini, System Architect
// Created: August 11, 2025 at 08:20 AM PDT
// Version: 2.0.0 (Architecturally Superior Version)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// The definitive Mongoose schema and model for the User entity. This is the
// central and most critical data model in the application.
//
// @architectural_notes
// - **Secure by Default**: The password field has `select: false`, which is a
//   non-negotiable standard. This ensures that the hashed password is never
//   accidentally exposed in API responses.
// - **Granular Permissions**: The model includes a 'permissions' array. This is
//   the foundation of our granular, permission-based security model, which is
//   superior to simple role checks for high-privilege actions.
// - **Data Integrity**: Uses Mongoose's built-in validation (required, enum)
//   to enforce data integrity at the database level.
//
// @todos
// - @free:
//   - [ ] Add pre-save middleware to automatically lowercase the user's email.
// - @premium:
//   - [ ] ✨ Add fields to store a user's connection to a Stripe Connect account for payouts.
// - @wow:
//   - [ ] 🚀 Implement a 'deactivate' method on the model that performs a "soft delete," anonymizing the user's data to comply with privacy regulations like GDPR, rather than permanently deleting the record.
//
// ----------------------------------------------------------------------

import { Schema, model, Document } from 'mongoose';
import { IUser } from '@/types'; // Assuming central types

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false }, // Never return password by default
  role: {
    type: String,
    enum: ['buyer', 'seller', 'hauler', 'mechanic', 'insurer', 'admin', 'officer', 'judge'],
    required: true,
  },
  permissions: {
    type: [String],
    default: [], // e.g., ['can_flag_users', 'can_promote_judge']
  },
  isPremium: { type: Boolean, default: false },
  onboarded: { type: Boolean, default: false },
  suspended: { type: Boolean, default: false },
  reputation: { type: Number, default: 100 },
  onboardingTasks: [{
    taskId: String,
    completed: Boolean,
    completedAt: Date,
  }],
}, { timestamps: true });

export const User = model<IUser>('User', UserSchema);