// ----------------------------------------------------------------------
// File: RealTimePredictor.ts
// Path: backend/services/premium/RealTimePredictor.ts
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// A high-performance, premium AI service for real-time bidding predictions
// and personalized, context-aware suggestions.
//
// @usage
// Called by protected API routes available only to premium users.
// e.g., `RealTimePredictor.getBiddingSuggestions(auctionId, userContext)`
//
// @architectural_notes
// - **High-Performance Caching**: The core `predictNextBid` function now uses
//   a Redis cache. This prevents redundant, expensive AI model calculations for
//   popular auctions, ensuring the service is fast and scalable.
// - **Personalized, Context-Aware AI**: The suggestion logic now accepts a
//   'userContext' object. This is our standard for evolving AI features from
//   generic tools into personalized advisors that deliver "Wow++" value.
//
// ----------------------------------------------------------------------

import logger from '@/utils/logger';
import db from '@/services/db';
import ai from '@/services/ai';
import redis from '@/services/redis';

// --- Type Definitions ---
interface IUserContext { userId: string; isPremium: boolean; budget?: number; }
interface IPrediction { amount: number; confidence: number; }

// --- Service Module ---
const RealTimePredictor = {
  /**
   * Predicts the next bid, using a cache to avoid redundant calculations.
   */
  async predictNextBid(auctionId: string, userContext: IUserContext): Promise<IPrediction> {
    if (!userContext.isPremium) throw new Error('Premium access required');

    const cacheKey = `prediction:auction:${auctionId}`;
    const cachedPrediction = await redis.get(cacheKey);

    if (cachedPrediction) {
      logger.info(`[RealTimePredictor] Cache HIT for auctionId: ${auctionId}`);
      return JSON.parse(cachedPrediction);
    }
    
    logger.info(`[RealTimePredictor] Cache MISS for auctionId: ${auctionId}`);
    const auction = await db.getAuction(auctionId);
    if (!auction) throw new Error('Auction not found');

    const prediction = await ai.predictNextBid(auction.bids, auction.timeRemaining);

    // Cache the result for 10 seconds
    await redis.set(cacheKey, JSON.stringify(prediction), { EX: 10 });
    
    return prediction;
  },

  /**
   * Generates personalized bidding suggestions based on AI predictions and user context.
   */
  async getBiddingSuggestions(auctionId: string, userContext: IUserContext): Promise<{ suggestions: string[]; prediction: IPrediction }> {
    const prediction = await this.predictNextBid(auctionId, userContext);
    const suggestions: string[] = [];

    // ARCHITECTURAL UPGRADE: Personalized, Context-Aware Suggestions
    if (userContext.budget && prediction.amount > userContext.budget) {
      suggestions.push(`⚠️ Caution: The predicted next bid of $${prediction.amount.toLocaleString()} exceeds your set budget of $${userContext.budget.toLocaleString()}.`);
    } else if (prediction.confidence > 0.7) {
      suggestions.push(`💡 Our AI is highly confident in its prediction. Bidding near $${prediction.amount.toLocaleString()} is a strong strategic move.`);
    } else {
      suggestions.push('Bidding is currently unpredictable. Proceed with caution.');
    }

    logger.info(`[RealTimePredictor] Generated bidding suggestions for auctionId: ${auctionId}`);
    return { suggestions, prediction };
  }
};

export default RealTimePredictor;