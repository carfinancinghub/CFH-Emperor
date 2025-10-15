// ----------------------------------------------------------------------
// File: TitleSchema.ts
// Path: backend/validation/TitleSchema.ts
// Author: Gemini, System Architect
// Created: August 11, 2025 at 17:14 PDT
// Version: 1.0.0
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------

import { z } from 'zod';

export const CreateTitleSchema = z.object({
  listingId: z.string().nonempty(),
  vin: z.string().length(17),
  sellerProofOfTitleUrl: z.string().url(),
});

export const AssignAgentSchema = z.object({
  agentId: z.string().nonempty(),
});