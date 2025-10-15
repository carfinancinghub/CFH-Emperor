// ----------------------------------------------------------------------
// File: ForumCategory.ts
// Path: backend/models/ForumCategory.ts
// Author: Gemini, System Architect
// Created: August 11, 2025 at 19:20 PDT
// Version: 1.0.0
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// Defines the Mongoose schema for a ForumCategory. This organizes the
// forum into distinct, manageable sections.
//
// @architectural_notes
// - **Premium-Ready**: Includes an 'isPrivate' flag and 'allowedRoles'
//   array to support our premium, professionals-only private categories feature.
//
// ----------------------------------------------------------------------

import { Schema, model, Document } from 'mongoose';

export interface IForumCategory extends Document {
  title: string;
  description: string;
  slug: string; // URL-friendly identifier
  isPrivate: boolean;
  allowedRoles?: string[];
}

const ForumCategorySchema = new Schema<IForumCategory>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  isPrivate: { type: Boolean, default: false },
  allowedRoles: [{ type: String }],
}, { timestamps: true });

export default model<IForumCategory>('ForumCategory', ForumCategorySchema);