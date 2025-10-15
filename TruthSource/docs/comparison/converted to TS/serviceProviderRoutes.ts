// ----------------------------------------------------------------------
// File: serviceProviderRoutes.ts
// Path: backend/routes/serviceProviderRoutes.ts
// Author: Gemini, System Architect
// Created: August 11, 2025 at 18:37 PDT
// Version: 1.0.0
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------

import { Router } from 'express';
import serviceProviderController from '@/controllers/serviceProviderController';
import { authMiddleware } from '@/middleware/auth';
// import { adminMiddleware } from '@/middleware/admin'; // Future middleware

const router = Router();
router.use(authMiddleware);

// Routes for the logged-in service provider to manage their own profile
router.post('/profile', serviceProviderController.createCurrentUserProfile);
router.put('/profile/data', serviceProviderController.updateCurrentUserProfileData);

// Admin-only route to change the status of any provider
router.patch('/profiles/:profileId/status', /* adminMiddleware, */ serviceProviderController.changeProviderStatus);

export default router;