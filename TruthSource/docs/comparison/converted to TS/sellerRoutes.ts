// File: sellerRoutes.ts
// Path: backend/routes/seller/sellerRoutes.ts
// 👑 Cod1 Crown Certified — Secure, multi-layered Seller API with backend business rule enforcement.

// TODO:
// @free:
//   - [ ] Add input validation (e.g., using Zod) to the request parameters to ensure the seller ID is in a valid format.
// @premium:
//   - [ ] ✨ Cache the results of these expensive data aggregation endpoints (e.g., for 5 minutes in Redis) to improve performance for frequently viewed seller profiles.
// @wow:
//   - [ ] 🚀 Create a new endpoint 'POST /:id/reputation/feedback' that allows sellers to submit feedback on their AI tips, which can be used to retrain and improve the AI model.

import { Router, Response } from 'express';
import auth, { AuthenticatedRequest } from '@/middleware/auth'; // Our standard auth middleware
import SellerBadgeEngine from '@/services/SellerBadgeEngine'; // Assuming service path
import Reputation from '@/models/system/Reputation';
import logger from '@/utils/logger'; // Our standard logger

const router = Router();

// --- Type Definitions ---
interface UserFromToken {
  id: string;
  role: 'seller' | 'admin' | 'buyer' | 'hauler';
  features: string[]; // e.g., ['aiCoach', 'advancedAnalytics']
}

/**
 * @route   GET /api/seller/:id/reputation/meta
 * @desc    Fetch seller's badge progress, AI tips, percentile, and ranking info
 * @access  Private (Authorized for self or admin)
 */
router.get('/:id/reputation/meta', auth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const sellerId = req.params.id;
    const user = req.user as UserFromToken;

    // ARCHITECTURAL UPGRADE: Authorization Check
    if (user.id !== sellerId && user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: You are not authorized to view this data.' });
    }

    const repData = await Reputation.findOne({ sellerId });
    if (!repData) return res.status(404).json({ message: 'Reputation data not found for this seller.' });

    const badgeProgress = SellerBadgeEngine.calculateProgress(repData);
    const aiInsights = SellerBadgeEngine.generateAiTips(repData);
    const ranking = await SellerBadgeEngine.getRanking(sellerId);

    return res.status(200).json({
      sellerId,
      currentScore: repData.score,
      badges: repData.badges,
      nextBadge: badgeProgress,
      aiTips: aiInsights,
      percentile: repData.percentile,
      ranking,
    });
  } catch (error) {
    // ARCHITECTURAL UPGRADE: Standardized Logging
    logger.error('Error in /reputation/meta:', { error, params: req.params });
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * @route   GET /api/seller/:id/coach-plan
 * @desc    Generate and return AI coaching plan
 * @access  Premium (Enforced on backend)
 */
router.get('/:id/coach-plan', auth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const sellerId = req.params.id;
    const user = req.user as UserFromToken;

    // ARCHITECTURAL UPGRADE: Authorization Check
    if (user.id !== sellerId && user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: You are not authorized to view this data.' });
    }
    
    // ARCHITECTURAL UPGRADE: Backend Business Rule Enforcement
    if (!user.features.includes('aiCoach')) {
      return res.status(403).json({ message: 'Forbidden: This is a premium feature. Please upgrade your plan.' });
    }

    const repData = await Reputation.findOne({ sellerId });
    if (!repData) return res.status(404).json({ message: 'Seller data not found.' });

    const plan = SellerBadgeEngine.generateReputationCoachPlan(repData);
    const steps = SellerBadgeEngine.generateVisualTimelineSteps(repData);

    res.status(200).json({
      sellerId,
      premiumUnlocked: ['sellerAnalytics', 'aiCoach'],
      coachPlan: plan,
      timeline: steps,
    });
  } catch (err) {
    const error = err as Error;
    logger.error('Error generating coach plan:', { error, params: req.params });
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;