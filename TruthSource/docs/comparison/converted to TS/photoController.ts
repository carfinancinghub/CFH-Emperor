// ----------------------------------------------------------------------
// File: photoController.ts
// Path: backend/controllers/photoController.ts
// Author: Gemini, System Architect
// Created: August 11, 2025 at 3:21 PM PDT
// Version: 1.0.0
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// The API controller for the Unified Photo Management System. It exposes
// the PhotoService's capabilities to the frontend.
//
// @architectural_notes
// - **Two-Phase Upload**: This controller exposes two endpoints that work
//   together to create a secure, two-phase upload process, which is a core
//   tenet of our photo management architecture.
//
// ----------------------------------------------------------------------

import { Response } from 'express';
import { AuthenticatedRequest } from '@/middleware/auth';
import PhotoService from '@/services/PhotoService';

const photoController = {
  /**
   * Generates a secure pre-signed URL for a client-side upload.
   */
  async generateUploadUrl(req: AuthenticatedRequest, res: Response) {
    try {
      const { contentType } = req.body;
      if (!contentType) {
        return res.status(400).json({ message: 'contentType is required.' });
      }

      const result = await PhotoService.getPresignedUploadUrl(contentType);
      res.status(200).json(result);
    } catch (err: any) {
      res.status(500).json({ message: 'Failed to generate upload URL.', error: err.message });
    }
  },

  /**
   * Saves a reference to a photo after it has been uploaded to cloud storage.
   */
  async savePhotoReference(req: AuthenticatedRequest, res: Response) {
    try {
      const { key, context, contextId, metadata } = req.body;
      if (!key || !context || !contextId || !metadata) {
        return res.status(400).json({ message: 'Missing required fields for saving photo reference.' });
      }

      const photo = await PhotoService.savePhotoReference(req.user.id, context, contextId, key, metadata);
      res.status(201).json(photo);
    } catch (err: any) {
      res.status(500).json({ message: 'Failed to save photo reference.', error: err.message });
    }
  },
};

export default photoController;