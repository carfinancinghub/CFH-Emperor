// ----------------------------------------------------------------------
// File: lenderProfileRoutes.ts
// Path: backend/src/routes/lender/lenderProfileRoutes.ts
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// A public-facing API route for fetching a lender's profile and reputation.
//
// @usage
// This endpoint is consumed by frontend components to display lender information
// to potential buyers.
//
// @architectural_notes
// - **Data Security via DTO**: This route uses a Data Transfer Object (DTO)
//   pattern (`createLenderProfileDTO`). This is our definitive standard for
//   public endpoints. It ensures we only expose a carefully selected subset of
//   data, preventing any accidental leakage of sensitive user information.
// - **Codebase Consistency**: We have standardized the middleware naming to 'auth'
//   and the error logging to use our central 'logger' utility.
// ----------------------------------------------------------------------
// --- FUTURE ENHANCEMENTS (TODO) ---
// @free:
//   - [ ] Add pagination to the reviews list instead of just slicing the first 5.
// @premium:
//   - [ ] ✨ If the viewing user is premium, reveal enhanced contact information for the lender (e.g., a direct phone line).
// @wow:
//   - [ ] 🚀 Integrate with a third-party business verification service (e.g., Dun & Bradstreet) to display a "Verified Business" badge on the lender's profile, dramatically increasing trust.
// ----------------------------------------------------------------------

import { Router, Request, Response } from 'express';
import User from '@/models/User';
import LenderReputation from '@/models/LenderReputation';
import logger from '@/utils/logger';
import { IUser, ILenderReputation } from '@/types'; // Assuming central types

const router = Router();

// --- ARCHITECTURAL UPGRADE: Data Transfer Object (DTO) Pattern ---
/**
 * Creates a public-safe lender profile object from the full user and reputation models.
 * @param lender The full Mongoose User document for the lender.
 * @param reputation The full Mongoose LenderReputation document.
 * @returns A public-safe object with only the necessary fields.
 */
const createLenderProfileDTO = (lender: IUser, reputation: ILenderReputation | null) => {
  return {
    lender: {
      id: lender._id,
      username: lender.username,
      avatarUrl: lender.avatarUrl,
      memberSince: lender.createdAt,
    },
    reputation: reputation ? {
      averageRating: reputation.averageRating,
      totalReviews: reputation.reviews.length,
      reviews: reputation.reviews.slice(0, 5), // Only return the 5 most recent reviews
    } : null,
  };
};


// @route   GET /api/lender/:lenderId/profile
// @desc    Public lender profile + reputation
// @access  Public
router.get('/:lenderId/profile', async (req: Request, res: Response) => {
  try {
    const lender = await User.findById(req.params.lenderId).select('-password');
    if (!lender || lender.role !== 'lender') {
      return res.status(404).json({ message: 'Lender not found' });
    }

    const reputation = await LenderReputation.findOne({ lender: lender._id })
      .populate('reviews.reviewer', 'username')
      .lean();

    // Use the DTO to create the final, safe response
    const lenderProfile = createLenderProfileDTO(lender, reputation);

    res.json(lenderProfile);
  } catch (err) {
    const error = err as Error;
    // ARCHITECTURAL UPGRADE: Standardized Logging
    logger.error(`Error fetching lender profile for ID ${req.params.lenderId}:`, error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;