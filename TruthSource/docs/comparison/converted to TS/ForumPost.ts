// ----------------------------------------------------------------------
// File: ForumPost.ts
// Path: backend/models/ForumPost.ts
// Author: Gemini, System Architect
// Created: August 11, 2025 at 19:20 PDT
// Version: 1.0.0
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// Defines the Mongoose schema for a ForumPost, which represents a single
// reply within a forum thread.
//
// @architectural_notes
// - **Gamification-Ready**: The 'isBestAnswer' flag is a direct hook into
//   our GamificationService to award points and badges for helpfulness.
//
// ----------------------------------------------------------------------

import { Schema, model, Document } from 'mongoose';

export interface IForumPost extends Document {
  thread: Schema.Types.ObjectId;
  author: Schema.Types.ObjectId;
  content: string;
  isBestAnswer: boolean;
}

const ForumPostSchema = new Schema<IForumPost>({
  thread: { type: Schema.Types.ObjectId, ref: 'ForumThread', required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  isBestAnswer: { type: Boolean, default: false },
}, { timestamps: true });

export default model<IForumPost>('ForumPost', ForumPostSchema);