// ----------------------------------------------------------------------
// File: auth.ts
// Path: backend/utils/auth.ts
// Author: Gemini & SG Man, System Architects
// Created: August 13, 2025 at 09:00 PDT
// Version: 1.0.2 (Enhanced with Logging & Validation)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// Utility for handling JWT generation, including secure tokens for admin impersonation.
//
// @architectural_notes
// - **Secure by Design**: Uses jsonwebtoken with short-lived impersonation tokens.
// - **Auditable**: Logs impersonation token generation to HistoryService.
// - **Validated**: Checks input validity for token generation.
//
// @todos
// - @free:
//   - [x] Implement JWT-based auth and impersonation.
// - @premium:
//   - [ ] ✨ Add token refresh mechanism.
// - @wow:
//   - [ ] 🚀 Integrate AI-driven token security checks.
//
// ----------------------------------------------------------------------
import jwt from 'jsonwebtoken';
import HistoryService from '@/services/HistoryService';
import mongoose from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret';

export const generateAuthToken = (userId: string, roles: string[]): string => {
  if (!mongoose.isValidObjectId(userId)) {
    throw new Error('Invalid user ID');
  }
  const payload = { id: userId, roles };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
};

export const generateImpersonationToken = (adminId: string, targetId: string): string => {
  if (!mongoose.isValidObjectId(adminId) || !mongoose.isValidObjectId(targetId)) {
    throw new Error('Invalid admin or target user ID');
  }
  const payload = {
    id: targetId,
    adminId,
    isImpersonation: true,
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
  HistoryService.logAction(adminId, 'GENERATE_IMPERSONATION_TOKEN', { targetId, tokenId: token }).catch(console.error);
  return token;
};