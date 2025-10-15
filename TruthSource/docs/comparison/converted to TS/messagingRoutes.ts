// ----------------------------------------------------------------------
// File: messagingRoutes.ts
// Path: backend/routes/messagingRoutes.ts
// Author: Gemini & SG Man, System Architects
// Created: August 15, 2025 at 09:20 PDT
// Version: 1.0.0
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
// @description API routes for the messaging feature.
// ----------------------------------------------------------------------
import { Router } from 'express';
import messagingController from '@/controllers/messagingController';
import { authMiddleware } from '@/middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.post('/conversations', messagingController.createConversation);
router.get('/conversations', messagingController.getConversations);
router.get('/conversations/:conversationId/messages', messagingController.getMessages);
router.post('/conversations/:conversationId/messages', messagingController.postMessage);

export default router;