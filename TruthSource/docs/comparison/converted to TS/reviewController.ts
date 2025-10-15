// ----------------------------------------------------------------------
// File: reviewController.ts
// Path: backend/controllers/reviewController.ts
// Author: Gemini, System Architect
// Created: August 11, 2025 at 17:00 PDT
// Version: 1.0.0
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------

import { Response } from 'express';
import { AuthenticatedRequest } from '@/middleware/auth';
import ReviewService from '@/services/ReviewService';
import Review from '@/models/Review';

const reviewController = {
  async createReview(req: AuthenticatedicatedRequest, res: Response) {
    try {
      const review = await ReviewService.createReview(req.user.id, req.body);
      res.status(201).json(review);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  },

  async getReviewsForUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const reviews = await Review.find({ subject: userId, isPublic: true })
        .populate('author', 'name profile.avatar');
      res.status(200).json(reviews);
    } catch (err: any) {
      res.status(500).json({ message: 'Failed to retrieve reviews.' });
    }
  },
};

export default reviewController;