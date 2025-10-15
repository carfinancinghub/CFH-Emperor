// ----------------------------------------------------------------------
// File: ratingsController.ts
// Path: backend/controllers/ratingsController.ts
// Author: Gemini & SG Man, System Architects
// Created: August 15, 2025 at 11:47 PDT
// Version: 1.0.1 (Added Zod Validation & Comment Block)
// ----------------------------------------------------------------------
// @description
// Controller for managing user ratings, including submission and retrieval.
//
// @architectural_notes
// - **Secure**: Requires authentication for submitting and viewing pending ratings.
// - **Reputation Update**: Recalculates `reputationScore` after each rating submission.
// - **Validated**: Uses Zod for input validation to ensure data integrity.
//
// @dependencies express zod @models/Rating @models/User @models/PendingRating @services/HistoryService mongoose
//
// @todos
// - @free:
//   - [x] Implement rating submission and retrieval.
//   - [x] Add reputation score recalculation.
// - @premium:
//   - [ ] ✨ Support rating responses.
// - @wow:
//   - [ ] 🚀 Integrate review moderation system.
// ----------------------------------------------------------------------
import { Request, Response } from 'express';
import { z } from 'zod';
import { Types } from 'mongoose';
import Rating from '@models/Rating';
import User from '@models/User';
import PendingRating from '@models/PendingRating';
import HistoryService from '@services/HistoryService';

const RatingSchema = z.object({
  pendingRatingId: z.string().refine((id) => Types.ObjectId.isValid(id), { message: 'Invalid pending rating ID' }),
  rating: z.number().int().min(1).max(5),
  review: z.string().max(500).optional(),
});

const updateUserReputation = async (userId: string) => {
  const stats = await Rating.aggregate([
    { $match: { toUser: new Types.ObjectId(userId) } },
    { $group: { _id: '$toUser', avgRating: { $avg: '$rating' } } }
  ]);
  const newScore = stats[0]?.avgRating || 0;
  await User.findByIdAndUpdate(userId, { reputationScore: newScore });
};

const ratingsController = {
  async getPendingRatings(req: Request, res: Response): Promise<void> {
    try {
      const ratings = await PendingRating.find({ fromUser: req.user!.id }).populate('toUser', 'name');
      res.status(200).json(ratings);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to fetch pending ratings.' });
    }
  },
  
  async getRatingsForUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      if (!Types.ObjectId.isValid(userId)) {
        res.status(400).json({ error: 'Invalid user ID.' });
        return;
      }
      const ratings = await Rating.find({ toUser: userId }).populate('fromUser', 'name');
      res.status(200).json(ratings);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to fetch ratings.' });
    }
  },

  async submitRating(req: Request, res: Response): Promise<void> {
    try {
      const { pendingRatingId, rating, review } = RatingSchema.parse(req.body);
      const pending = await PendingRating.findById(pendingRatingId).populate('transaction');

      if (!pending || pending.fromUser.toString() !== req.user!.id) {
        res.status(403).json({ error: 'Invalid rating request.' });
        return;
      }

      const newRating = await Rating.create({
        fromUser: pending.fromUser,
        toUser: pending.toUser,
        auction: (pending.transaction as any).auction,
        rating,
        review,
      });

      await updateUserReputation(pending.toUser.toString());
      await pending.deleteOne();

      await HistoryService.logAction(req.user!.id, 'SUBMIT_RATING', { ratingId: newRating._id });
      res.status(201).json(newRating);
    } catch (error: any) {
      res.status(error instanceof z.ZodError ? 400 : 500).json({ error: error.message });
    }
  }
};

export default ratingsController;