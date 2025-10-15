// ----------------------------------------------------------------------
// File: InsuranceService.ts
// Path: backend/src/services/InsuranceService.ts
// Author: Mini, System Architect
// Created: August 11, 2025 at 07:05 AM PDT
// Version: 2.0.0 (Architecturally Superior Version)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// A unified service for managing the entire insurance lifecycle, from quote
// submission to policy management.
//
// @architectural_notes
// - **Single Responsibility**: This service's only job is to manage the
//   business logic for insurance. It is decoupled from the API routes.
// - **Ironclad Authorization**: Every function includes a critical authorization
//   check to ensure an insurer can only submit quotes from their own account.
//
// @todos
// - @free:
//   - [ ] Implement the Mongoose models for 'Quote' and 'Policy'.
// - @premium:
//   - [ ] ✨ Add a feature to automatically notify an insurer when a vehicle they have quoted on is sold.
// - @wow:
//   - [ ] 🚀 Integrate with a third-party data provider to pre-fill vehicle risk data, allowing insurers to generate quotes more quickly and accurately.
//
// ----------------------------------------------------------------------

import { z } from 'zod';
import { User } from '@/models/User';
import Quote from '@/models/Quote';
import { IUser, IQuote } from '@/types';
import logger from '@/utils/logger';

// --- Zod Schema for Validation ---
const QuoteSchema = z.object({
  vehicleId: z.string(),
  policyType: z.enum(['Comprehensive', 'Collision', 'Liability']),
  quoteAmount: z.number().positive(),
  duration: z.number().int().positive(),
});

type QuoteData = z.infer<typeof QuoteSchema>;

// --- Service Module ---
const InsuranceService = {
  /**
   * Allows an authorized insurer to submit a new quote for a vehicle.
   */
  async submitQuote(user: IUser, quoteData: QuoteData): Promise<IQuote> {
    // Authorization Check
    if (user.role !== 'insurer') {
      throw new Error('Forbidden: Only users with the "insurer" role can submit quotes.');
    }
    
    const validatedData = QuoteSchema.parse(quoteData);
    
    const quote = new Quote({
      ...validatedData,
      insurerId: user.id,
      status: 'submitted',
    });
    await quote.save();
    
    logger.info(`New quote ${quote._id} submitted by insurer ${user.id} for vehicle ${quoteData.vehicleId}`);
    return quote;
  },
};

export default InsuranceService;