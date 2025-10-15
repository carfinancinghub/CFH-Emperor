// ----------------------------------------------------------------------
// File: verificationRoutes.ts
// Path: backend/routes/verificationRoutes.ts
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// API routes for managing user verification status.
//
// @usage
// These routes are consumed by admin panels to approve or reject user
// verification requests and by users to check their own status.
//
// @architectural_notes
// - **Prevents Mass Assignment**: The PATCH endpoint explicitly extracts only
//   the allowed fields from the request body, preventing mass assignment
//   vulnerabilities. This is our standard for all update operations.
// - **Full Audit Trail**: All status changes made by an admin are logged
//   using the SecurityLogger service. This is a non-negotiable standard for
//   accountability on all administrative actions.
// - **Correct HTTP Semantics**: Uses PATCH for partial updates, adhering to
//   RESTful design principles.
//
// ----------------------------------------------------------------------

import express, { Response } from 'express';
import { AuthenticatedRequest } from '@/middleware/auth';
import Verification from '@/models/Verification';
import auth from '@/middleware/auth';
import SecurityLogger from '@/services/security/SecurityLogger';

const router = express.Router();

// --- Type Definitions ---
interface UpdateVerificationBody {
  status: 'pending' | 'verified' | 'rejected';
  notes?: string;
}

// GET verification info for current user
router.get('/', auth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const record = await Verification.findOne({ userId: req.user._id });
    if (!record) return res.status(404).json({ error: 'No verification record found.' });
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch verification data.' });
  }
});

// PATCH update verification status (admin only)
router.patch('/:userId', auth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin role required.' });
    }

    // ARCHITECTURAL UPGRADE: Prevent Mass Assignment Vulnerability
    const { status, notes } = req.body as UpdateVerificationBody;
    const updateData = { status, notes }; // Only use the allowed fields

    const updated = await Verification.findOneAndUpdate(
      { userId: req.params.userId },
      { $set: updateData },
      { new: true, upsert: true }
    );
    
    // ARCHITECTURAL UPGRADE: Full Audit Trail
    await SecurityLogger.logSecurityEvent('ADMIN_UPDATE_VERIFICATION', 'CRITICAL', {
      adminId: req.user.id,
      targetUserId: req.params.userId,
      newStatus: status
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update verification status.' });
  }
});

export default router;