// ----------------------------------------------------------------------
// File: profileRoutes.ts
// Path: backend/routes/profileRoutes.ts
// Author: Gemini & SG Man, System Architects
// Created: August 15, 2025 at 10:55 PDT
// Version: 1.0.0
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
// @description API routes for the user profile feature.
// ----------------------------------------------------------------------
import { Router } from 'express';
import profileController from '@/controllers/profileController';
import { authMiddleware } from '@/middleware/authMiddleware';

const router = Router();

// Protect all profile routes
router.use(authMiddleware);

router.get('/profile', profileController.getProfile);
router.patch('/profile', profileController.updateProfile);

export default router;