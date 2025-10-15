/*
 * File: userProfileRoutes.ts
 * Path: C:\CFH\backend\routes\user\userProfileRoutes.ts
 * Created: 2025-07-25 17:15 PDT
 * Author: Mini (AI Assistant)
 * Version: 1.0
 * Description: API routes for user profile management.
 * Artifact ID: route-user-profile
 * Version ID: route-user-profile-v1.0.0
 */

import express, { Request, Response } from 'express';
import logger from '@utils/logger';
import { UserProfileService } from '@services/user/UserProfileService';
// import { authenticateToken } from '@middleware/authMiddleware'; // TODO: Implement auth middleware
// import { z } from 'zod'; // TODO: Install and configure Zod for validation

// --- Type Definition ---
interface AuthenticatedRequest extends Request {
    user?: { id: string };
}

// --- Placeholder Mocks ---
const authenticateToken = (req: AuthenticatedRequest, res: Response, next: Function) => {
    req.user = { id: 'mockUserId' };
    next();
};
// --- End Mocks ---

const router = express.Router();

// --- Zod Validation Schema (Suggestion) ---
// const updateProfileSchema = z.object({
//   username: z.string().min(3).optional(),
//   email: z.string().email().optional(),
// });

// GET user profile
router.get('/profile', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const profile = await UserProfileService.getUserProfile(userId);
    if (!profile) {
      return res.status(404).json({ message: 'User profile not found.' });
    }
    res.status(200).json(profile);
  } catch (err) {
    logger.error('Failed to fetch user profile', { error: (err as Error).message, userId: req.user?.id });
    res.status(500).json({ message: 'Unable to retrieve profile' });
  }
});

// PUT (or PATCH) update user profile
router.put('/profile', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    // TODO: Add Zod validation middleware here
    const userId = req.user!.id;
    const updatedProfile = await UserProfileService.updateUserProfile(userId, req.body);
    res.status(200).json(updatedProfile);
  } catch (err) {
    logger.error('Failed to update user profile', { error: (err as Error).message, userId: req.user?.id });
    res.status(500).json({ message: 'Unable to update profile' });
  }
});

export default router;
