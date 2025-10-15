// ----------------------------------------------------------------------
// File: PendingRating.ts
// Path: backend/models/PendingRating.ts
// Author: Gemini & SG Man, System Architects
// Created: August 15, 2025 at 11:46 PDT
// Version: 1.0.1 (Enhanced Comment Block)
// ----------------------------------------------------------------------
// @description
// Mongoose model for pending rating prompts, created post-transaction to decouple rating submission.
//
// @architectural_notes
// - **Indexing**: `fromUser` is indexed for efficient retrieval of pending ratings.
// - **Timestamps**: Includes `createdAt` for tracking prompt age.
// - **Asynchronous**: Enables delayed rating submission by users.
//
// @dependencies mongoose
//
// @todos
// - @free:
//   - [x] Define pending rating model.
//   - [x] Add indexing for performance.
// - @premium:
//   - [ ] ✨ Add expiration for pending ratings.
// - @wow:
//   - [ ] 🚀 Notify users of pending ratings via notifications.
// ----------------------------------------------------------------------
import { Schema, model, Document, Types } from 'mongoose';

export interface IPendingRating extends Document {
  transaction: Types.ObjectId;
  fromUser: Types.ObjectId;
  toUser: Types.ObjectId;
  createdAt: Date;
}

const PendingRatingSchema = new Schema<IPendingRating>({
  transaction: { type: Schema.Types.ObjectId, ref: 'Transaction', required: true },
  fromUser: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  toUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: { createdAt: true, updatedAt: false } });

export default model<IPendingRating>('PendingRating', PendingRatingSchema);