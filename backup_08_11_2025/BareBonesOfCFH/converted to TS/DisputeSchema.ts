// ----------------------------------------------------------------------
// File: DisputeSchema.ts
// Path: backend/validation/DisputeSchema.ts
// Author: Gemini, System Architect
// Created: August 11, 2025 at 4:52 PM PDT
// Version: 1.0.0
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// Defines Zod validation schemas for the Dispute Resolution System.
//
// ----------------------------------------------------------------------

import { z } from 'zod';

export const OpenDisputeSchema = z.object({
  reason: z.string().min(20, { message: 'Please provide a detailed reason of at least 20 characters.' }),
  defendantId: z.string().nonempty({ message: 'A defendant must be specified.' }),
  auctionId: z.string().nonempty({ message: 'A related auction must be specified.' }),
});

export const AddMessageSchema = z.object({
  message: z.string().min(1, { message: 'Message cannot be empty.' }),
  attachmentIds: z.array(z.string()).optional(), // Array of Photo model IDs
});