// ----------------------------------------------------------------------
// File: historyRoutes.ts
// Path: backend/routes/historyRoutes.ts
// Author: Gemini, System Architect
// Created: August 11, 2025 at 19:12 PDT
// Version: 1.0.0
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------

import { Router } from 'express';
import historyController from '@/controllers/historyController';
import { authMiddleware } from '@/middleware/auth';

const router = Router();
router.use(authMiddleware);

// Get the logged-in user's sent offers
router.get('/made', historyController.getOffersMade);

// Get the logged-in user's received offers
router.get('/received', historyController.getOffersReceived);

export default router;