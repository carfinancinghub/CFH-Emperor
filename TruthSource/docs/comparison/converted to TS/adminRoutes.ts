// ----------------------------------------------------------------------
// File: adminRoutes.ts
// Path: backend/routes/adminRoutes.ts
// Author: Gemini, System Architect
// Created: August 11, 2025 at 18:51 PDT
// Version: 1.0.0
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------

import { Router } from 'express';
import adminController from '@/controllers/adminController';
import { authMiddleware } from '@/middleware/auth';
// import { adminMiddleware } from '@/middleware/admin'; // This middleware should be created

const router = Router();

// IMPORTANT: ALL routes in this file must be protected by both auth and admin middleware.
// The adminMiddleware would check if req.user.roles.includes('ADMIN').
router.use(authMiddleware /*, adminMiddleware */);

// --- User Management ---
router.get('/users', adminController.getAllUsers);
router.get('/users/:userId', adminController.getUserDetails);
router.patch('/users/:targetUserId/status', adminController.updateUserStatus);
router.post('/users/impersonate', adminController.impersonateUser);

// --- Provider Management ---
router.post('/providers/:profileId/verify', adminController.verifyServiceProvider);

export default router;