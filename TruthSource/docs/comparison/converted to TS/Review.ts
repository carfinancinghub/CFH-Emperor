// ----------------------------------------------------------------------
// File: Review.ts
// Path: backend/models/Review.ts
// Author: Gemini, System Architect
// Created: August 11, 2025 at 16:58 PDT
// Version: 1.0.0
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// Defines the Mongoose schema for the Review entity. This model captures
// user feedback and ratings to build a transparent reputation system.
//
// @architectural_notes
// - **Transaction-Linked**: Every review is tied to a specific 'auction',
//   ensuring all feedback is based on a real transaction.
// - **Premium-Ready**: Includes an 'isVerified' flag to support the premium
//   "Verified Transaction" feature, adding value and trust.
// - **Uniqueness Enforced**: A compound index prevents a user from leaving
//   more than one review for the same user on the same auction.
//
// @todos
// - @free:
//   - [ ] Build the service logic to calculate and cache average ratings on the User model.
// - @premium:
//   - [ ] ✨ Implement the 'isVerified' logic by checking against our payment system records.
//   - [ ] ✨ Add a 'privateFeedback' text field for the premium private feedback feature.
// - @wow:
//   - [ ] 🚀 Integrate an AI service to analyze the 'comment' text for sentiment (positive, neutral, negative).
//
// ----------------------------------------------------------------------

import { Schema, model, Document } from 'mongoose';

export interface IReview extends Document {
  author: Schema.Types.ObjectId;
  subject: Schema.Types.ObjectId; // The user being reviewed
  auction: Schema.Types.ObjectId;
  rating: number;
  comment?: string;
  isVerified: boolean;
  isPublic: boolean;
}

const ReviewSchema = new Schema<IReview>({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  auction: { type: Schema.Types.ObjectId, ref: 'Auction', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, maxlength: 2000 },
  isVerified: { type: Boolean, default: false },
  isPublic: { type: Boolean, default: true },
}, { timestamps: true });

// Prevent a user from reviewing the same person on the same auction more than once
ReviewSchema.index({ author: 1, subject: 1, auction: 1 }, { unique: true });

export default model<IReview>('Review', ReviewSchema);