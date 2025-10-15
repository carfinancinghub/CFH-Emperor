// ----------------------------------------------------------------------
// File: notificationsRoutes.ts
// Path: backend/routes/notificationsRoutes.ts
// Author: Gemini & SG Man, System Architects
// Created: August 15, 2025 at 11:32 PDT
// Version: 1.0.0
// ----------------------------------------------------------------------
// @description API routes for notification subscriptions.
// @dependencies express @controllers/notificationsController @middleware/authMiddleware
// ----------------------------------------------------------------------
import { Router } from 'express';
import notificationsController from '@controllers/notificationsController';
import { authMiddleware } from '@middleware/authMiddleware';

const router = Router();
router.use(authMiddleware);
router.post('/subscribe', notificationsController.subscribe);

export default router;