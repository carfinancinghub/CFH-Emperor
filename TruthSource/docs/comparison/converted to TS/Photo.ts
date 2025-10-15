// ----------------------------------------------------------------------
// File: Photo.ts
// Path: backend/models/Photo.ts
// Author: Gemini, System Architect
// Created: August 11, 2025 at 3:18 PM PDT
// Version: 1.0.0
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// Defines the Mongoose schema for the Photo entity. This provides a single
// source of truth for tracking every photo asset within the CFH ecosystem.
//
// @architectural_notes
// - **Unified & Contextual**: The 'context' and 'contextId' fields allow
//   this single model to be flexibly associated with any other entity
//   (Listings, Users, Disputes), creating a truly unified system.
// - **Performance-Ready**: A compound index on 'context' and 'contextId' is
//   included to ensure efficient querying when retrieving photos for a
//   specific item.
//
// @todos
// - @free:
//   - [ ] Add a 'tags' array to the metadata for the AI object recognition feature.
// - @premium:
//   - [ ] ✨ Add a 'isWatermarked' boolean flag to track the status of our premium watermarking feature.
// - @wow:
//   - [ ] 🚀 Add a 'perceptionHash' field to help detect duplicate or visually similar images.
//
// ----------------------------------------------------------------------

import { Schema, model, Document } from 'mongoose';

export interface IPhoto extends Document {
  url: string;
  key: string; // The object key in the S3 bucket, needed for deletions
  owner: Schema.Types.ObjectId;
  context: 'LISTING' | 'PROFILE' | 'DISPUTE_EVIDENCE' | 'DELIVERY_PROOF';
  contextId: Schema.Types.ObjectId; // The ID of the Listing, User, Dispute, etc.
  metadata: {
    size: number; // in bytes
    contentType: string;
    height?: number;
    width?: number;
  };
}

const PhotoSchema = new Schema<IPhoto>({
  url: { type: String, required: true, unique: true },
  key: { type: String, required: true, unique: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  context: {
    type: String,
    enum: ['LISTING', 'PROFILE', 'DISPUTE_EVIDENCE', 'DELIVERY_PROOF'],
    required: true,
  },
  contextId: { type: Schema.Types.ObjectId, required: true },
  metadata: {
    size: { type: Number, required: true },
    contentType: { type: String, required: true },
    height: { type: Number },
    width: { type: Number },
  },
}, { timestamps: true });

// Add a compound index for efficient lookups
PhotoSchema.index({ context: 1, contextId: 1 });

export default model<IPhoto>('Photo', PhotoSchema);