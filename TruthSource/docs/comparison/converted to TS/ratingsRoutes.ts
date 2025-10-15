// ----------------------------------------------------------------------
// File: ratingsRoutes.ts
// Path: backend/routes/ratingsRoutes.ts
// Author: Gemini & SG Man, System Architects
// Created: August 15, 2025 at 11:47 PDT
// Version: 1.0.1 (Enhanced Comment Block)
// ----------------------------------------------------------------------
// @description
// API routes for managing user ratings and pending rating prompts.
//
// @architectural_notes
// - **Secure**: Uses `authMiddleware` for protected endpoints.
// - **Public Access**: Allows unauthenticated access to view user ratings for transparency.
//
// @dependencies express @controllers/ratingsController @middleware/authMiddleware
//
// @todos
// - @free:
//   - [x] Define rating submission and retrieval routes.
// - @premium:
//   - [ ] ✨ Add route for rating responses.
// - @wow:
//   - [ ] 🚀 Support bulk rating retrieval for analytics.
// ----------------------------------------------------------------------
import { Router } from 'express';
import ratingsController from '@controllers/ratingsController';
import { authMiddleware } from '@middleware/authMiddleware';

const router = Router();
router.get('/user/:userId', ratingsController.getRatingsForUser);

router.use(authMiddleware);
router.get('/pending', ratingsController.getPendingRatings);
router.post('/', ratingsController.submitRating);

export default router;