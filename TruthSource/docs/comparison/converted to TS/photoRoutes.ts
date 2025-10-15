// ----------------------------------------------------------------------
// File: photoRoutes.ts
// Path: backend/routes/photoRoutes.ts
// Author: Gemini, System Architect
// Created: August 11, 2025 at 3:21 PM PDT
// Version: 1.0.0
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------

import { Router } from 'express';
import photoController from '@/controllers/photoController';
import { authMiddleware } from '@/middleware/auth';

const router = Router();

// All photo routes are protected and require a logged-in user
router.use(authMiddleware);

// Route to get a secure URL for uploading a file
router.post('/generate-upload-url', photoController.generateUploadUrl);

// Route to confirm an upload and save its reference in our database
router.post('/save-reference', photoController.savePhotoReference);

export default router;