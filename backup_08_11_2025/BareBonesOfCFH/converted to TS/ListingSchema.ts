// ----------------------------------------------------------------------
// File: ListingSchema.ts
// Path: backend/validation/ListingSchema.ts
// Author: Gemini, System Architect
// Created: August 11, 2025 at 12:27 PM PDT
// Version: 1.0.0
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// A centralized Zod schema for validating all incoming vehicle listing
// data, ensuring data integrity and security at the service layer.
//
// @architectural_notes
// - **Single Source of Truth**: This schema acts as the definitive source
//   for all listing validation rules, reusable across the application.
// - **Secure by Default**: By validating at the service boundary, we prevent
//   malformed data from ever reaching our core business logic or database.
//
// @todos
// - @free:
//   - [ ] Add a `.refine()` call for cross-field validation (e.g., ensure a classic car model has a reasonable year).
// - @premium:
//   - [ ] ✨ Internationalize error messages based on user locale.
// - @wow:
//   - [ ] 🚀 Create a dynamic schema that adjusts required fields based on vehicle type (e.g., electric cars need 'battery_health').
//
// ----------------------------------------------------------------------

import { z } from 'zod';

/**
 * Zod schema for creating a new vehicle listing.
 * Enforces type and format rules for all listing properties.
 */
export const ListingSchema = z.object({
  vin: z.string().length(17, { message: 'VIN must be exactly 17 characters.' }),
  make: z.string().min(2, { message: 'Make must be at least 2 characters.' }),
  model: z.string().min(1, { message: 'Model is required.' }),
  year: z.number().int().min(1900, { message: 'Invalid year.' }).max(new Date().getFullYear() + 1, { message: 'Year cannot be in the future.' }),
  mileage: z.number().int().min(0, { message: 'Mileage cannot be negative.' }),
  price: z.number().positive({ message: 'Price must be a positive number.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  photos: z.array(z.string().url({ message: 'Each photo must be a valid URL.' })).min(1, { message: 'At least one photo is required.' }).max(5, { message: 'You can upload a maximum of 5 photos.' }),
});