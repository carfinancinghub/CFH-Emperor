// ----------------------------------------------------------------------
// File: onboardingController.ts
// Path: backend/controllers/onboardingController.ts
// Author: Gemini, System Architect
// Created: August 11, 2025 at 12:02 PM PDT
// Version: 2.1.0 (Refactored for SOA)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// A lean, efficient controller for the user onboarding API. It handles HTTP
// requests and delegates all business logic to the `OnboardingService`.
//
// @architectural_notes
// - **SOA Adherence**: This controller has been refactored to be a pure
//   controller. All database and business logic has been moved to the
//   `OnboardingService` to align with our service-oriented architecture.
// - **Lean Endpoints**: The endpoints (`getOnboardingProgress`, `completeOnboardingTask`)
//   are now lightweight, responsible only for request/response handling.
//
// @todos
// - @free:
//   - [ ] Add comprehensive end-to-end tests for both API routes.
// - @premium:
//   - [ ] ✨ After a user completes their final task, trigger a WebSocket event for a real-time celebration popup.
// - @wow:
//   - [ ] 🚀 Implement API versioning in the route path (e.g., /api/v2/onboarding) for future-proofing.
//
// ----------------------------------------------------------------------

import { Response } from 'express';
import { z } from 'zod';
import { AuthenticatedRequest } from '@/middleware/auth';
import User from '@/models/User';
import logger from '@/utils/logger';
import { onboardingTracks } from '@/config/onboarding';
import OnboardingService from '@/services/OnboardingService';

/**
 * @desc    Get the user's current onboarding progress, tailored to their role.
 * @route   GET /api/onboarding/progress
 * @access  Private
 */
export const getOnboardingProgress = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // The controller uses the service to get data
    const tasks = await OnboardingService.getOnboardingTasks(req.user);
    res.json(tasks);
  } catch (err) {
    logger.error('Failed to fetch onboarding progress:', err);
    res.status(500).json({ message: 'Failed to fetch onboarding progress' });
  }
};

/**
 * @desc    Mark an onboarding task as complete for the user.
 * @route   POST /api/onboarding/complete
 * @access  Private
 */
export const completeOnboardingTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { taskId } = req.body;
    // The controller's responsibility is now to simply call the service
    await OnboardingService.markTaskAsComplete(req.user.id, taskId);

    res.status(200).json({ message: 'Task marked as complete' });
  } catch (err: any) {
    logger.error('Failed to complete onboarding task:', err);
    // Handle specific validation errors from the service
    if (err instanceof z.ZodError) {
        return res.status(400).json({ message: 'A valid taskId is required.' });
    }
    res.status(500).json({ message: 'Failed to complete onboarding task' });
  }
};