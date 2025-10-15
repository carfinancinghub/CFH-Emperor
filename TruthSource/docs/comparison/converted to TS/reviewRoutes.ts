// ----------------------------------------------------------------------
// File: reviewRoutes.ts
// Path: backend/routes/reviewRoutes.ts
// Author: Gemini, System Architect
// Created: August 11, 2025 at 17:00 PDT
// Version: 1.0.0
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------

import { Router } from 'express';
import reviewController from '@/controllers/reviewController';
import { authMiddleware } from '@/middleware/auth';

const router = Router();

// Get public reviews for a specific user
router.get('/user/:userId', reviewController.getReviewsForUser);

// All routes below this require authentication
router.use(authMiddleware);

// Create a new review
router.post('/', reviewController.createReview);

export default router;