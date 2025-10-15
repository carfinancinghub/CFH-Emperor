// ----------------------------------------------------------------------
// File: proofOfDeliveryController.ts
// Path: backend/src/controllers/hauler/proofOfDeliveryController.ts
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// A secure controller for handling the submission and retrieval of
// proof of delivery from haulers.
//
// @usage
// These controller functions are imported and used by the hauler-specific
// express router to define the API endpoints.
//
// @architectural_notes
// - **Critical Authorization**: The `submitProofOfDelivery` function MUST verify
//   that the authenticated user's ID matches the 'haulerId' on the job. This
//   is a non-negotiable security standard.
// - **Secure File Handling**: While this version accepts photo URLs, the superior
//   long-term standard is for this endpoint to accept 'multipart/form-data',
//   handle the file upload to secure storage (e.g., S3) directly, and then
//   save our own generated URL. This prevents arbitrary URL injection.
// - **Data Validation**: All incoming data (especially complex data like a
//   'geoPin') should be validated for correct format before being saved.
//
// ----------------------------------------------------------------------

// --- FUTURE ENHANCEMENTS (TODO) ---
// @free:
//   - [ ] Implement robust validation for the incoming request body using Zod to ensure data integrity.
// @premium:
//   - [ ] ✨ After a successful delivery, automatically generate a PDF "Bill of Lading" document that the hauler can access.
// @wow:
//   - [ ] 🚀 Use a mapping service to validate that the submitted 'geoPin' is within a reasonable radius (e.g., 1 mile) of the vehicle's actual delivery address, providing an advanced layer of fraud detection.


import { Response } from 'express';
import { AuthenticatedRequest } from '@/middleware/auth';
import HaulerJob from '@/models/HaulerJob';
import asyncHandler from 'express-async-handler';
import logger from '@/utils/logger';

// --- Type Definitions ---
interface ProofOfDeliveryBody {
  geoPin?: object; // In a real app, define a strict GeoJSON interface
  notes?: string;
  photoUrls?: string[];
}

// --- Controller Functions ---

/**
 * @desc    Submit GeoPin and Photo Proof of Delivery
 * @route   POST /api/hauler/jobs/:jobId/proof-of-delivery
 * @access  Private
 */
export const submitProofOfDelivery = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { jobId } = req.params;
  const { geoPin, notes, photoUrls = [] } = req.body as ProofOfDeliveryBody;

  const job = await HaulerJob.findById(jobId);
  if (!job) {
    res.status(404).json({ message: 'Delivery job not found' });
    return;
  }

  // ARCHITECTURAL UPGRADE: Critical Authorization Check
  if (job.haulerId.toString() !== req.user.id) {
    logger.warn(`[AUTH] User ${req.user.id} attempted to submit proof for job ${jobId} owned by ${job.haulerId}.`);
    res.status(403).json({ message: 'Forbidden: You can only submit proof for your own jobs.' });
    return;
  }

  // TODO: Add validation for the geoPin format here

  job.geoPin = geoPin || job.geoPin;
  job.notes = notes || job.notes;
  job.photos = photoUrls.length > 0 ? photoUrls : job.photos;
  job.status = 'Delivered';
  job.deliveredAt = new Date();

  await job.save();
  res.status(200).json({ message: '📍 Delivery marked complete', job });
});

/**
 * @desc    Retrieve Delivery Proof for Display
 * @route   GET /api/hauler/jobs/:jobId/proof-of-delivery
 * @access  Private
 */
export const getProofOfDelivery = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { jobId } = req.params;
  const job = await HaulerJob.findById(jobId).select('geoPin notes photos deliveredAt');
  
  if (!job) {
    res.status(404).json({ message: 'Job not found' });
    return;
  }
  
  // A future authorization check could be added here as well
  res.status(200).json(job);
});