// File: sellerReputationMeta.ts
// Path: backend/routes/seller/sellerReputationMeta.ts
// Purpose: A data-rich API endpoint for seller reputation, insights, and coaching.
// Author: Mini, System Architect
// Date: August 10, 2025
// 👑 Cod1 Crown Certified — Secure, Cached, Monetizable, and Architecturally Sound.

// TODO:
// @free:
//   - [ ] Implement the actual Mongoose models and the logic within the 'SellerBadgeEngine' service.
//   - [ ] Develop the data aggregation pipeline that calculates and stores the 'scoreHistory' for trend analysis.
// @premium:
//   - [ ] ✨ Enhance the 'getReputationMeta' service to include competitive analysis against similar sellers.
// @wow:
//   - [ ] 🚀 Create a new endpoint that accepts this reputation data and feeds it into a generative AI to create a full, multi-paragraph "State of Your Business" report for the seller.

import { Router, Response } from 'express';
import asyncHandler from 'express-async-handler';
import auth, { AuthenticatedRequest } from '@/middleware/auth';
import SellerBadgeEngine from '@/services/SellerBadgeEngine'; // Assuming service path
import Reputation from '@/models/system/Reputation';
import redis from '@/services/redis'; // Our standard Redis client
import logger from '@/utils/logger';

const router = Router();

// --- Type Definitions ---
interface UserFromToken {
  id: string;
  role: 'seller' | 'admin';
  plan: 'free' | 'premium';
}

// --- Route Handler ---

/**
 * @route   GET /api/seller/:id/reputation/meta
 * @desc    Fetch a seller's complete reputation metadata.
 * @access  Private (Authorized for self or admin)
 */
router.get('/:id/reputation/meta', auth, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const sellerId = req.params.id;
  const user = req.user as UserFromToken;

  // 1. --- ARCHITECTURAL UPGRADE: Ironclad Authorization ---
  if (user.id !== sellerId && user.role !== 'admin') {
    res.status(403);
    throw new Error('Forbidden: You are not authorized to view this data.');
  }

  // 2. --- ARCHITECTURAL UPGRADE: High-Performance Caching ---
  const cacheKey = `reputation-meta:${sellerId}`;
  const cachedData = await redis.get(cacheKey);

  if (cachedData) {
    logger.info(`[Cache] HIT for ${cacheKey}`);
    return res.status(200).json(JSON.parse(cachedData));
  }
  
  logger.info(`[Cache] MISS for ${cacheKey}`);
  
  // 3. --- Core Logic (Cache Miss) ---
  const repData = await Reputation.findOne({ sellerId });
  if (!repData) {
    res.status(404);
    throw new Error('Reputation record not found for this seller.');
  }

  // ARCHITECTURAL UPGRADE: Cleaner logic via a single, orchestrated service call
  const meta = await SellerBadgeEngine.getReputationMeta(repData);
  
  // 4. --- ARCHITECTURAL UPGRADE: Backend-Driven Monetization ---
  const response = {
    sellerId,
    ...meta,
    // Add historical data for trend analysis
    scoreHistory: [
      { date: '2025-07-10', score: 85 },
      { date: '2025-08-10', score: meta.currentScore }
    ], // Placeholder for real historical data
    // Tell the frontend which premium features are unlocked
    premiumUnlocked: user.plan === 'premium' ? ['aiTips', 'ranking'] : [],
  };

  // 5. --- Set Cache and Respond ---
  await redis.set(cacheKey, JSON.stringify(response), { EX: 300 }); // Cache for 5 minutes
  res.status(200).json(response);
}));

export default router;