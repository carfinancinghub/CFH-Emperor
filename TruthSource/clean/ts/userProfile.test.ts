/**
 * Â© 2025 CFH, All Rights Reserved
 * Purpose: User Profile routes for the CFH Automotive Ecosystem
 * Author: CFH Dev Team
 * Date: 2025-06-22T17:44:00.000Z
 * Version: 1.0.0
 * Crown Certified: Yes
 * Batch ID: UserProfile-061725
 * Save Location: C:\CFH\backend\routes\user\userProfile.ts
 */

import express, { Request, Response, Router } from 'express';
import logger from '@utils/logger';
import { authenticateToken } from '@middleware/authMiddleware';
import { getUserProfile, updateUserProfile } from '@services/userProfileService';
import Joi from 'joi';

interface UserRequest extends Request {
  user?: {
    id: string;
  };
}

const updateSchema = Joi.object({
  username: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
});

const router: Router = express.Router();

router.get('/user/profile', authenticateToken, async (req: UserRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(400).json({ message: 'User ID is missing' });
      return;
    }
    const profile = await getUserProfile(userId);
    res.status(200).json(profile);
  } catch (err) {
    logger.error('Failed to fetch user profile', {
      error: (err as Error).message,
      userId: req.user?.id,
      timestamp: new Date().toISOString(),
    });
    res.status(500).json({ message: 'Unable to retrieve profile' });
  }
});

router.put('/user/profile', authenticateToken, async (req: UserRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(400).json({ message: 'User ID is missing' });
      return;
    }
    const { error } = updateSchema.validate(req.body);
    if (error) {
      logger.warn('Invalid profile update data', {
        error: error.details,
        userId,
        timestamp: new Date().toISOString(),
      });
      res.status(400).json({ message: error.details[0].message });
      return;
    }
    const updatedProfile = await updateUserProfile(userId, req.body);
    res.status(200).json(updatedProfile);
  } catch (err) {
    logger.error('Failed to update user profile', {
      error: (err as Error).message,
      userId: req.user?.id,
      timestamp: new Date().toISOString(),
    });
    res.status(500).json({ message: 'Unable to update profile' });
  }
});

export default router;

/** TODO:
 * - Implement more comprehensive error handling and logging.
 * - Add unit tests for the service functions.
 * - Consider adding rate limiting to the routes.
 */
