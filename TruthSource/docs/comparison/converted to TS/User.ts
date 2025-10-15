// ----------------------------------------------------------------------
// File: User.ts
// Path: backend/models/User.ts
// Author: Gemini & SG Man, System Architects
// Created: August 12, 2025 at 14:00 PDT
// Version: 1.0.4 (Added Reputation Score)
// ----------------------------------------------------------------------
// @description
// Mongoose model for users, including profile, watchlist, notification tokens, and reputation score.
//
// @architectural_notes
// - **Core Model**: Unified model for all user types (buyers, sellers, admins, providers).
// - **Indexes**: `email` and `reputationScore` indexed for efficient queries.
// - **Secure**: Excludes `password` and `fcmTokens` in queries by default.
// - **Extensible**: Supports profile, watchlist, and reputation features.
//
// @dependencies mongoose
//
// @todos
// - @free:
//   - [x] Add basic user model.
//   - [x] Add profile, watchlist, fcmTokens, reputationScore.
// - @premium:
//   - [ ] ✨ Add analytics for user activity.
// - @wow:
//   - [ ] 🚀 Implement AI-driven behavior tracking.
// ----------------------------------------------------------------------
import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  roles: string[];
  status: 'ACTIVE' | 'SUSPENDED' | 'BANNED';
  bio?: string;
  avatar?: string;
  location?: string;
  serviceProviderProfile?: string;
  watchlist: Types.ObjectId[];
  fcmTokens: string[];
  reputationScore: number;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true, select: false },
  roles: [{ type: String, enum: ['USER', 'ADMIN', 'PROVIDER'], default: ['USER'] }],
  status: { type: String, enum: ['ACTIVE', 'SUSPENDED', 'BANNED'], default: 'ACTIVE' },
  bio: { type: String, maxLength: 500 },
  avatar: { type: String, match: [/^https?:\/\/.+\..+/, 'Please enter a valid URL'] },
  location: { type: String, maxLength: 100 },
  serviceProviderProfile: { type: Schema.Types.ObjectId, ref: 'ServiceProviderProfile', required: false },
  watchlist: [{ type: Schema.Types.ObjectId, ref: 'Auction' }],
  fcmTokens: { type: [String], select: false },
  reputationScore: { type: Number, default: 0, index: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IUser>('User', UserSchema);