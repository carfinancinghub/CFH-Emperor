// ----------------------------------------------------------------------
// File: Rating.ts
// Path: backend/models/Rating.ts
// Author: Gemini & SG Man, System Architects
// Created: August 15, 2025 at 11:46 PDT
// Version: 1.0.1 (Enhanced Comment Block)
// ----------------------------------------------------------------------
// @description
// Mongoose model for user ratings, capturing feedback between buyers and sellers post-transaction.
//
// @architectural_notes
// - **Indexing**: `toUser` is indexed for efficient retrieval of user ratings.
// - **Timestamps**: Includes `createdAt` for tracking rating age.
// - **Validation**: Enforces `rating` range (1-5) and `review` length.
//
// @dependencies mongoose
//
// @todos
// - @free:
//   - [x] Define core rating model.
//   - [x] Add indexing for performance.
// - @premium:
//   - [ ] ✨ Support rating responses.
// - @wow:
//   - [ ] 🚀 Add sentiment analysis for reviews.
// ----------------------------------------------------------------------
import { Schema, model, Document, Types } from 'mongoose';

export interface IRating extends Document {
  fromUser: Types.ObjectId;
  toUser: Types.ObjectId;
  auction: Types.ObjectId;
  rating: number;
  review: string;
  createdAt: Date;
}

const RatingSchema = new Schema<IRating>({
  fromUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  toUser: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  auction: { type: Schema.Types.ObjectId, ref: 'Auction', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String, maxLength: 500 },
}, { timestamps: { createdAt: true, updatedAt: false } });

export default model<IRating>('Rating', RatingSchema);