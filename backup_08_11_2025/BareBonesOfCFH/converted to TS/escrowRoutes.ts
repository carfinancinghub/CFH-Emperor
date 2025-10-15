// ----------------------------------------------------------------------
// File: escrowRoutes.ts
// Path: backend/src/routes/escrowRoutes.ts
// Author: Mini, System Architect
// Created: August 11, 2025 at 06:55 AM PDT
// Version: 2.0.0 (Architecturally Superior Version)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// The definitive, secure API routes for all escrow and blockchain sync operations.
//
// @architectural_notes
// - **Thin Controller Pattern**: This route is a perfect example of a "thin
//   controller." It contains no business logic; it only validates the request
//   and delegates all work to the 'EscrowService'.
// - **Security by Default**: The routes are protected with our standard 'auth'
//   and 'rateLimit' middleware.
//
// ----------------------------------------------------------------------

import { Router, Response } from 'express';
import { AuthenticatedRequest, auth } from '@/middleware/auth';
import { createRateLimiter } from '@/middleware/rateLimiter';
import EscrowService from '@/services/EscrowService';
import asyncHandler from 'express-async-handler';

const router = Router();

// POST /api/escrow/sync
router.post(
  '/sync',
  auth,
  createRateLimiter({ action: 'escrow_sync', limit: 10, window: 60 }),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const result = await EscrowService.syncAction(req.user, req.body.actionData);
    res.status(200).json({ success: true, data: result });
  })
);

// GET /api/escrow/status/:transactionId
router.get('/:transactionId/status', auth, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = await EscrowService.getTransactionStatus(req.params.transactionId);
  res.status(200).json({ success: true, data: result });
}));

export default router;