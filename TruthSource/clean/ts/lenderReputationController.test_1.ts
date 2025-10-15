// File: lenderReputationController.ts
// Path: backend/controllers/lender/lenderReputationController.ts

/**
 * CFH Automotive Ecosystem
 * Crown Certified Code
 * Author: [Your Name]
 * Date: [Current Date]
 * Description: Controller for managing lender reputations.
 */

import { Request, Response } from 'express';
import LenderReputation, { ILenderReputation } from '../../models/LenderReputation';

// GET /api/lender-reputation/:lenderId
export const getReputation = async (req: Request, res: Response): Promise<Response> => {
  try {
    const reputation: ILenderReputation | null = await LenderReputation.findOne({ lender: req.params.lenderId })
      .populate('lender', 'username')
      .populate('reviews.reviewer', 'username');

    if (!reputation) {
      return res.status(404).json({ message: 'Reputation not found' });
    }

    return res.json(reputation);
  } catch (error) {
    console.error('Error fetching lender reputation:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/lender-reputation/:lenderId/review
export const addReview = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { rating, comment }: { rating: number; comment: string } = req.body;
    let reputation: ILenderReputation | null = await LenderReputation.findOne({ lender: req.params.lenderId });

    if (!reputation) {
      reputation = new LenderReputation({ lender: req.params.lenderId, reviews: [] });
    }

    reputation.reviews.push({
      reviewer: req.user.id,
      rating,
      comment
    });

    // Recalculate average rating
    const total: number = reputation.reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0);
    reputation.rating = total / reputation.reviews.length;
    reputation.updatedAt = new Date();

    await reputation.save();
    return res.status(201).json(reputation);
  } catch (error) {
    console.error('Error adding lender review:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/** TODO:
 * - Add validation for input data.
 * - Implement authentication and authorization checks.
 * - Consider using a service layer for business logic separation.
 * - Add more detailed error handling and logging.
 */
