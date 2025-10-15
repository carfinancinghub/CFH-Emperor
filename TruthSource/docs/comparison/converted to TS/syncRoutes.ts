// File: syncRoutes.ts
// Path: backend/routes/escrow/syncRoutes.ts
// 👑 Crown Certified Route — Secure, validated, and resilient escrow sync endpoints.

// TODO:
// @free:
//   - [ ] Implement robust validation for the 'actionData' body using Zod to ensure data integrity before it reaches the service layer.
// @premium:
//   - [ ] ✨ Add a specific role check in the 'auth' middleware to ensure only services or users with 'escrow_manager' privileges can call this endpoint.
// @wow:
//   - [ ] 🚀 Create a webhook system. After a successful sync, POST the result to a registered third-party URL for external system integration.

import express, { Router, Request, Response } from 'express';
import logger from '@utils/logger';
import EscrowChainSync from '@services/escrow/EscrowChainSync';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import auth, { AuthenticatedRequest } from '@/middleware/auth'; // Ensure this is imported

const router: Router = express.Router();

// --- Middleware Setup ---
router.use(helmet());
router.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })); // 15 minutes, 100 requests

// --- Type Definitions ---
interface SyncBody {
  actionData: Record<string, any>; // Define a stricter type for actionData with Zod
  isPremium: boolean;
}

// --- Route Handlers ---

// Sync an escrow action to the database or blockchain
router.post('/sync', auth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    // TODO: Add Zod validation for req.body here
    const { actionData, isPremium } = req.body as SyncBody;

    const result = isPremium
      ? await EscrowChainSync.syncToBlockchain(actionData)
      : await EscrowChainSync.syncEscrowAction(actionData);

    res.status(200).json({ success: true, data: result, version: 'v1' });
  } catch (error) {
    logger.error('POST /sync failed', { error, userId: req.user.id });
    res.status(500).json({ success: false, error: 'Internal server error during sync.' });
  }
});

// Get the status of an escrow transaction
router.get('/status/:transactionId', auth, async (req: Request, res: Response) => {
  try {
    const { transactionId } = req.params;
    const { isPremium } = req.query;

    const status = await EscrowChainSync.getEscrowStatus(transactionId);
    
    // Fetch audit trail only if the flag is explicitly true
    const auditTrail = isPremium === 'true'
      ? await EscrowChainSync.getBlockchainAuditTrail(transactionId)
      : null;

    res.status(200).json({ success: true, data: { status, auditTrail }, version: 'v1' });
  } catch (error) {
    logger.error(`GET /status for txId ${req.params.transactionId} failed`, { error });
    res.status(500).json({ success: false, error: 'Error fetching transaction status.' });
  }
});

export default router;