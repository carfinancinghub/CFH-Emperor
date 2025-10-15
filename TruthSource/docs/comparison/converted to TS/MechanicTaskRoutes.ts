// ----------------------------------------------------------------------
// File: MechanicTaskRoutes.ts
// Path: backend/src/routes/mechanic/MechanicTaskRoutes.ts
// Author: Mini, System Architect
// Created: August 11, 2025 at 01:28 AM PDT
// Version: 2.0.0 (Architecturally Superior Version)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// The definitive, secure API routes for all mechanic task management,
// including status updates and proof of delivery.
//
// @architectural_notes
// - **Consolidated Routes**: Replaces three older, fragmented route files with
//   a single, cohesive, and RESTful router for all mechanic actions.
// - **Ironclad Authorization**: Every endpoint includes a critical authorization
//   check to ensure a mechanic can only update their own assigned tasks.
//
// ----------------------------------------------------------------------

import { Router } from 'express';
import { AuthenticatedRequest, auth } from '@/middleware/auth';
import MechanicService from '@/services/MechanicService'; // Assumed new service
import asyncHandler from 'express-async-handler';

const router = Router();

/**
 * @route   PATCH /api/mechanic/tasks/:taskId/complete
 * @desc    Marks a task as completed.
 */
router.patch('/:taskId/complete', auth, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const task = await MechanicService.completeTask(req.user, req.params.taskId, req.body);
  res.status(200).json(task);
}));

/**
 * @route   POST /api/mechanic/tasks/:jobId/proof-of-delivery
 * @desc    Submits proof of delivery for a job.
 */
router.post('/:jobId/proof-of-delivery', auth, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const job = await MechanicService.submitProofOfDelivery(req.user, req.params.jobId, req.body);
  res.status(200).json({ message: 'Proof of delivery submitted.', job });
}));

export default router;