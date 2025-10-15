// ----------------------------------------------------------------------
// File: optionRoutes.ts
// Path: backend/routes/optionRoutes.ts
// Author: Gemini, System Architect
// Created: August 11, 2025 at 2:45 PM PDT
// Version: 1.0.0
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------

import { Router } from 'express';
import optionController from '@/controllers/optionController';
import { authMiddleware } from '@/middleware/auth';

const router = Router();

// All option routes are protected
router.use(authMiddleware);

// Create a new Option for a listing
router.post('/listing/:listingId', optionController.createOptionForListing);

// Place a bid on an existing Option
router.post('/:optionId/bids', optionController.placeBidOnOption);

// Accept a bid on an Option
router.post('/bids/:bidId/accept', optionController.acceptOptionBid);

export default router;