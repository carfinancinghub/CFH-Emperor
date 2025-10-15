// ----------------------------------------------------------------------
// File: OptionSchema.ts
// Path: backend/validation/OptionSchema.ts
// Author: Gemini, System Architect
// Created: August 11, 2025 at 2:39 PM PDT
// Version: 1.0.0
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// Defines the Zod validation schemas for the competitive option system.
//
// ----------------------------------------------------------------------

import { z } from 'zod';

/**
 * Schema for validating the input when a user places a bid on an Option.
 */
export const PlaceOptionBidSchema = z.object({
  downpaymentAmount: z.number().positive({ message: 'Downpayment must be a positive number.' }),
  holdDays: z.number().int().min(1, { message: 'Hold days must be at least 1.' }).max(90, { message: 'Hold days cannot exceed 90.' }),
});