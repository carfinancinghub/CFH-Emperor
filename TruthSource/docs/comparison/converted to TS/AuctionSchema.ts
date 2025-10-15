// ----------------------------------------------------------------------
// File: AuctionSchema.ts
// Path: backend/validation/AuctionSchema.ts
// Author: Gemini, System Architect
// Created: August 11, 2025 at 2:41 PM PDT
// Version: 1.0.0
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// Defines Zod validation schemas for creating auctions and placing bids,
// ensuring data integrity for the core marketplace engine.
//
// ----------------------------------------------------------------------

import { z } from 'zod';

const ServiceEnum = z.enum(['FINANCING', 'TRANSPORT', 'INSURANCE', 'ESCROW', 'MECHANIC', 'STORAGE']);

export const CreateServicesAuctionSchema = z.object({
  servicesRequired: z.array(ServiceEnum).min(1, { message: 'At least one service must be selected.' }),
});

export const PlaceBidSchema = z.object({
  amount: z.number().positive(),
  // The following fields are only required for a 'SERVICE_OFFER'
  serviceType: ServiceEnum.optional(),
  terms: z.string().min(10, { message: 'Terms must be at least 10 characters.' }).optional(),
});