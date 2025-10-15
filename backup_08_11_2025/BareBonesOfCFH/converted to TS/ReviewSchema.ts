// ----------------------------------------------------------------------
// File: ReviewSchema.ts
// Path: backend/validation/ReviewSchema.ts
// Author: Gemini, System Architect
// Created: August 11, 2025 at 17:00 PDT
// Version: 1.0.0
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------

import { z } from 'zod';

export const CreateReviewSchema = z.object({
  subjectId: z.string().nonempty(),
  auctionId: z.string().nonempty(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(2000).optional(),
  isPublic: z.boolean().default(true),
});