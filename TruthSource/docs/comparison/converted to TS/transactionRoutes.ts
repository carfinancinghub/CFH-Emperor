// ----------------------------------------------------------------------
// File: transactionRoutes.ts
// Path: backend/routes/transactionRoutes.ts
// Author: Gemini & SG Man, System Architects
// Created: August 12, 2025 at 15:25 PDT
// Version: 1.0.2 (Enhanced with List Route)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// API routes for transaction finalization and listing endpoints.
//
// @architectural_notes
// - **Secure**: Requires both auth and admin middleware.
// - **Versioned**: Uses /api/v1/ prefix for compatibility.
// - **Focused**: Endpoints for finalization and transaction listing.
//
// @todos
// - @free:
//   - [x] Add endpoint for auction finalization.
//   - [x] Add endpoint for listing transactions.
// - @premium:
//   - [ ] ✨ Add route for transaction analytics.
//
// ----------------------------------------------------------------------
import { Router } from 'express';
import transactionController from '@/controllers/transactionController';
import authMiddleware from '@/middleware/authMiddleware';
import adminMiddleware from '@/middleware/adminMiddleware';

const router = Router();

// Protected routes
router.use(authMiddleware, adminMiddleware);

/**
 * @route POST /api/v1/transactions/finalize/:auctionId
 * @desc Finalize a completed auction
 * @access Admin
 */
router.post('/finalize/:auctionId', transactionController.finalizeAuction);

/**
 * @route GET /api/v1/transactions
 * @desc Get paginated list of transactions
 * @access Admin
 */
router.get('/', transactionController.getTransactions);

export default router;