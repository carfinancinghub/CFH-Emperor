// ----------------------------------------------------------------------
// File: titleRoutes.ts
// Path: backend/routes/titleRoutes.ts
// Author: Gemini, System Architect
// Created: August 11, 2025 at 17:14 PDT
// Version: 2.0.0 (Refactored)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------

import { Router } from 'express';
import titleController from '@/controllers/titleController';
import { authMiddleware } from '@/middleware/auth';

const router = Router();
router.use(authMiddleware);

// Seller creates a title record for their listing
router.post('/', titleController.createTitle);

// (Premium) Admin/System triggers the automated check
router.post('/:titleId/verify', titleController.runVerification);

// Title Agent routes
router.get('/agent/queue', titleController.getAgentQueue);
router.patch('/agent/:titleId/assign', titleController.assignAgent);

export default router;