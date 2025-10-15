// ----------------------------------------------------------------------
// File: payouts.ts
// Path: backend/src/services/payouts.ts & backend/src/routes/payouts.ts
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// A resilient, asynchronous system for handling payouts to sellers,
// built on a background job queue.
//
// @architectural_notes
// - **Asynchronous Job Queue**: Payouts are no longer processed in the same
//   moment as the API request. The API's only job is to add a 'payout' task
//   to a background queue. A separate, dedicated worker process handles the
//   actual communication with the payment provider (e.g., Stripe Connect).
//   This is our standard for making critical operations resilient to failure.
//
// ----------------------------------------------------------------------

import { Router, Response } from 'express';
import { AuthenticatedRequest, auth, adminOnly } from '@/middleware/auth';
import Ledger from '@/models/Ledger';
import queue from '@/services/queue';
import logger from '@/utils/logger';

const router = Router();

// --- Payout Service Logic ---
// In a real app, this might live in its own service file.
const PayoutService = {
  initiatePayout: async (ledgerId: string) => {
    const payout = await Ledger.findById(ledgerId);
    if (!payout || payout.paid) {
      throw new Error('Payout already processed or not found');
    }

    // Add the job to the queue for a background worker to process
    await queue.add('process-payout', {
      ledgerId,
      recipientId: payout.recipient,
      amount: payout.amount
    });
    
    payout.status = 'Processing';
    await payout.save();

    logger.info(`[PayoutService] Payout for ledger ${ledgerId} has been queued.`);
    return payout;
  }
};


// --- The API Route ---
// This route is now "thin" and only responsible for initiating the job.
router.post(
  '/:ledgerId/pay',
  auth,
  adminOnly, // Only admins can trigger payouts
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const payout = await PayoutService.initiatePayout(req.params.ledgerId);
      res.status(202).json({ message: 'Payout processing has been initiated.', payout });
    } catch (err) {
      const error = err as Error;
      res.status(400).json({ message: error.message });
    }
  }
);

export default router;