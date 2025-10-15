// ----------------------------------------------------------------------
// File: disputeRoutes.ts
// Path: backend/routes/disputeRoutes.ts
// Author: Gemini, System Architect
// Created: August 11, 2025 at 16:57 PDT
// Version: 1.0.0
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------

import { Router } from 'express';
import disputeController from '@/controllers/disputeController';
import { authMiddleware } from '@/middleware/auth';

const router = Router();

router.use(authMiddleware);

// Open a new dispute
router.post('/', disputeController.openDispute);

// Get a single dispute with all its messages
router.get('/:disputeId', disputeController.getDisputeById);

// Add a message to a dispute
router.post('/:disputeId/messages', disputeController.addMessage);

// Change the status of a dispute (for admins/moderators)
router.patch('/:disputeId/status', disputeController.changeStatus);

export default router;