// Crown Certified Header
// File: lenderReputationTracker.ts
// Path: backend/controllers/lender/lenderReputationTracker.ts
// Description: Handles lender reputation retrieval and review addition for the CFH Automotive Ecosystem.

import { Request, Response } from 'express';
import LenderReputation, { ILenderReputation } from '../models/LenderReputation';

// Get lender reputation
export const getReputation = async (req: Request, res: Response): Promise<void> => {
  try {
    const reputation: ILenderReputation | null = await LenderReputation.findOne({ lender: req.params.lenderId })
      .populate('lender', 'username email')
      .populate('reviews.reviewer', 'username');
    if (!reputation) {
      res.status(404).json({ message: 'Reputation not found' });
      return;
    }
    res.json(reputation);
  } catch (error) {
    console.error('[Reputation Fetch Error]:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a review to a lender
export const addReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { rating, comment }: { rating: number; comment: string } = req.body;
    const lenderId: string = req.params.lenderId;
    const reviewerId: string = req.user.id;

    let reputation: ILenderReputation | null = await LenderReputation.findOne({ lender: lenderId });
    if (!reputation) {
      reputation = new LenderReputation({ lender: lenderId, reviews: [] });
    }

    reputation.reviews.push({ reviewer: reviewerId, rating, comment });
    const avgRating: number =
      reputation.reviews.reduce((sum, r) => sum + r.rating, 0) / reputation.reviews.length;
    reputation.rating = avgRating;
    reputation.updatedAt = new Date();

    await reputation.save();
    res.status(201).json(reputation);
  } catch (error) {
    console.error('[Add Review Error]:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/** TODO */
// Suggestions:
// 1. Implement input validation for `rating` and `comment` to ensure data integrity.
// 2. Consider adding logging for successful operations for better traceability.
// 3. Explore caching strategies for frequently accessed lender reputations to improve performance.
