// ----------------------------------------------------------------------
// File: uploadRoutes.ts
// Path: backend/src/routes/uploadRoutes.ts
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// The single, unified API route for handling all secure file uploads.
//
// @usage
// This router is mounted in `server.ts`. It's the sole entry point for
// any file uploads from the frontend.
//
// @architectural_notes
// - **Thin Controller**: This route handler is intentionally "thin." It's only
//   responsible for receiving the request and delegating the complex business
//   logic to the `PhotoService`. This is a core tenet of our architecture.
// - **In-Memory Storage**: Uses `multer.memoryStorage()` to handle the file as a
//   buffer in memory. This is a high-performance approach that avoids writing
//   to the local disk, which is crucial for a scalable, cloud-native application.
//
// ----------------------------------------------------------------------

import { Router } from 'express';
import multer from 'multer';
import { AuthenticatedRequest, auth } from '@/middleware/auth';
import PhotoService from '@/services/PhotoService';

const router = Router();

// Configure multer to handle file uploads in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * @route   POST /api/uploads
 * @desc    Handles all file uploads, delegates processing to PhotoService
 * @access  Private
 */
router.post('/', auth, upload.single('photo'), async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file was uploaded.' });
    }

    const { caption, type, sourceId } = req.body;
    const user = req.user; // User from our auth middleware

    const result = await PhotoService.uploadPhoto({
      file: req.file,
      caption,
      context: { type, sourceId },
      uploadedBy: user,
    });
    
    res.status(201).json(result);
  } catch (error) {
    next(error); // Pass error to our global error handler
  }
});

export default router;