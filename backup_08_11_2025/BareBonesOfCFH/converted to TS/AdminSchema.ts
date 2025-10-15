// ----------------------------------------------------------------------
// File: 
// Path: backend/validation/AdminSchema.ts
// Author: Gemini, System Architect
// Created: August 11, 2025 at 18:49 PDT
// Version: 1.0.0
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------

import { z } from 'zod';

export const UpdateUserStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'SUSPENDED', 'BANNED']),
});

export const ImpersonateUserSchema = z.object({
  targetUserId: z.string().nonempty(),
});