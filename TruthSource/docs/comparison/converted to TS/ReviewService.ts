// ----------------------------------------------------------------------
// File: ReviewService.ts
// Path: backend/services/ReviewService.ts
// Author: Gemini, System Architect
// Created: August 11, 2025 at 17:00 PDT
// Version: 1.0.0
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------

import Review from '@/models/Review';
import User from '@/models/User';
import { CreateReviewSchema } from '@/validation/ReviewSchema';

const ReviewService = {
  /**
   * Creates a review and triggers an update of the subject's aggregate rating.
   */
  async createReview(authorId: string, reviewData: any) {
    const { subjectId, auctionId, rating, comment, isPublic } = CreateReviewSchema.parse(reviewData);

    // Prevent duplicate reviews
    const existingReview = await Review.findOne({ author: authorId, subject: subjectId, auction: auctionId });
    if (existingReview) {
      throw new Error('You have already submitted a review for this transaction.');
    }

    const newReview = new Review({
      author: authorId,
      subject: subjectId,
      auction: auctionId,
      rating,
      comment,
      isPublic,
    });
    
    await newReview.save();
    
    // Asynchronously update the user's aggregate rating.
    // This could also be a background job in a real production system.
    this.updateAggregateRating(subjectId);
    
    return newReview;
  },

  /**
   * Calculates and saves the new average rating for a user.
   */
  async updateAggregateRating(userId: string) {
    const stats = await Review.aggregate([
      { $match: { subject: new mongoose.Types.ObjectId(userId), isPublic: true } },
      { $group: { _id: '$subject', avgRating: { $avg: '$rating' }, reviewCount: { $sum: 1 } } },
    ]);

    if (stats.length > 0) {
      const { avgRating, reviewCount } = stats[0];
      await User.findByIdAndUpdate(userId, {
        $set: {
          'reputation.averageRating': parseFloat(avgRating.toFixed(2)),
          'reputation.reviewCount': reviewCount,
        },
      });
    }
  },
};

export default ReviewService;