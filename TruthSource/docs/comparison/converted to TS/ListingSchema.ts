// ----------------------------------------------------------------------
// File: ListingSchema.ts
// Path: backend/validation/ListingSchema.ts
// Author: Gemini & SG Man, System Architects
// Created: August 12, 2025 at 16:47 PDT
// Version: 1.0.0 (Initial Implementation)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// Zod schema for validating listing data during creation and updates.
//
// @architectural_notes
// - **Strict Validation**: Ensures listing fields meet requirements.
// - **Flexible**: Supports partial updates for editing.
//
// @todos
// - @free:
//   - [x] Add basic listing validation.
// - @premium:
//   - [ ] ✨ Add validation for premium listing features.
// - @wow:
//   - [ ] 🚀 Add AI-driven listing validation rules.
//
// ----------------------------------------------------------------------
import { z } from 'zod';

export const ListingSchema = z.object({
  vin: z.string().min(17, 'VIN must be 17 characters').max(17),
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.number().min(1900).max(2026),
  mileage: z.number().min(0, 'Mileage cannot be negative'),
  price: z.number().min(0, 'Price cannot be negative'),
  description: z.string().max(1000, 'Description too long').optional(),
  photos: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid photo ID')).optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'SOLD']).optional(),
});