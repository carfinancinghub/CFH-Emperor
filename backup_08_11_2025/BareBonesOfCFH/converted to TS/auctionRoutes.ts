// ----------------------------------------------------------------------
// File: auctionRoutes.ts
// Path: backend/routes/auctionRoutes.ts
// Author: Gemini, System Architect
// Created: August 11, 2025 at 2:45 PM PDT
// Version: 1.0.0
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------

import { Router } from 'express';
import auctionController from '@/controllers/auctionController';
import { authMiddleware } from '@/middleware/auth';

const router = Router();

router.use(authMiddleware);

// Create different types of auctions
router.post('/sale/:listingId', auctionController.createSaleAuction);
router.post('/services/:listingId', auctionController.createServicesAuction);

// Place a bid on any active auction
router.post('/:auctionId/bids', auctionController.placeBid);

// Select winning bids for an auction
router.post('/:auctionId/select-winners', auctionController.selectWinningBids);

export default router;