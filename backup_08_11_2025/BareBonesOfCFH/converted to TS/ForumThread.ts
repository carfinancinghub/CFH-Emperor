// ----------------------------------------------------------------------
// File: ForumThread.ts
// Path: backend/models/ForumThread.ts
// Author: Gemini, System Architect
// Created: August 11, 2025 at 19:20 PDT
// Version: 1.0.0
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// Defines the Mongoose schema for a ForumThread. This is the top-level
// post that initiates a conversation.
//
// @architectural_notes
// - **Performance-Optimized**: Includes denormalized 'replyCount' and
//   'lastReplyAt' fields to allow for efficient sorting and display of
//   thread lists without expensive database joins.
//
// ----------------------------------------------------------------------

import { Schema, model, Document } from 'mongoose';

export interface IForumThread extends Document {
  title: string;
  content: string;
  author: Schema.Types.ObjectId;
  category: Schema.Types.ObjectId;
  isPinned: boolean;
  isLocked: boolean;
  replyCount: number;
  lastReplyAt: Date;
}

const ForumThreadSchema = new Schema<IForumThread>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: Schema.Types.ObjectId, ref: 'ForumCategory', required: true },
  isPinned: { type: Boolean, default: false },
  isLocked: { type: Boolean, default: false },
  replyCount: { type: Number, default: 0 },
  lastReplyAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default model<IForumThread>('ForumThread', ForumThreadSchema);