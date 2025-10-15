// ----------------------------------------------------------------------
// File: ServiceProviderSchema.ts
// Path: backend/validation/ServiceProviderSchema.ts
// Author: Gemini, System Architect
// Created: August 11, 2025 at 18:37 PDT
// Version: 1.0.0
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------

import { z } from 'zod';

const ProviderTypeEnum = z.enum(['LENDER', 'INSURER', 'MECHANIC', 'HAULER', 'TITLE_AGENT']);
const StatusEnum = z.enum(['ACTIVE', 'SUSPENDED']);

export const CreateProfileSchema = z.object({
  providerType: ProviderTypeEnum,
  businessName: z.string().min(2),
  licenseNumber: z.string().optional(),
  profileData: z.object({}).passthrough(), // Allows any object structure
});

export const ChangeStatusSchema = z.object({
  status: StatusEnum,
});