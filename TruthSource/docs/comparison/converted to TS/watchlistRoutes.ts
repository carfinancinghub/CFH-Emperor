// ----------------------------------------------------------------------
// File: watchlistRoutes.ts
// Path: backend/routes/watchlistRoutes.ts
// Author: Gemini & SG Man, System Architects
// Created: August 15, 2025 at 11:22 PDT
// Version: 1.0.0
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
// @description API routes for the auction watchlist feature.
// ----------------------------------------------------------------------
import { Router } from 'express';
import watchlistController from '@/controllers/watchlistController';
import { authMiddleware } from '@/middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/', watchlistController.getWatchlist);
router.post('/:auctionId', watchlistController.addToWatchlist);
router.delete('/:auctionId', watchlistController.removeFromWatchlist);

export default router;