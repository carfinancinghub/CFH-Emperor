// ----------------------------------------------------------------------
// File: auctionRoutes.ts
// Path: backend/routes/auctionRoutes.ts
// Author: Gemini & SG Man, System Architects
// Created: August 12, 2025 at 09:32 PDT
// Version: 1.2.1 (Enhanced with Detailed Routes)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// API routes for auction-related endpoints, including public and protected routes.
//
// @architectural_notes
// - **Public Access**: GET / and GET /:auctionId are public for marketplace viewing.
// - **Rate Limiting**: Applies rate limiting to public routes to prevent abuse.
// - **Versioned API**: Uses /api/v1 prefix for future compatibility.
//
// @todos
// - @free:
//   - [x] Add public endpoint for active auctions.
//   - [x] Add public endpoint for single auction details.
// - @premium:
//   - [ ] ✨ Add route for premium auction analytics.
//
// ----------------------------------------------------------------------
import { Router } from 'express';
import auctionController from '@/controllers/auctionController';
import authMiddleware from '@/middleware/authMiddleware';
import rateLimitMiddleware from '@/middleware/rateLimitMiddleware';

const router = Router();

// Public routes
/**
 * @route GET /api/v1/auctions
 * @desc Get paginated list of active auctions
 * @access Public
 */
router.get('/', rateLimitMiddleware, auctionController.getActiveAuctions);

/**
 * @route GET /api/v1/auctions/:auctionId
 * @desc Get full details for a single auction
 * @access Public
 */
router.get('/:auctionId', rateLimitMiddleware, auctionController.getAuctionById);

// Protected routes
router.use(authMiddleware);

// Other routes (e.g., POST /bids)
router.post('/:auctionId/bids', auctionController.placeBid); // Placeholder for bidding route

export default router;