// ----------------------------------------------------------------------
// File: profileViewRoutes.ts
// Path: backend/src/routes/profileViewRoutes.ts
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// API routes for logging and retrieving "who's viewed your profile" data.
//
// @usage
// The POST endpoint is called from a frontend component when a user's profile
// is loaded. The GET endpoint is used in a user's private dashboard.
//
// @architectural_notes
// - **Abuse Prevention (Rate Limiting)**: The data-creating POST endpoint is
//   now protected by our standard 'createRateLimiter' middleware. This is a
//   non-negotiable standard for any endpoint that writes to the database.
// - **Data Integrity (No Self-Views)**: The logic now explicitly prevents
//   users from logging views on their own profile, ensuring the analytics
//   data remains clean and meaningful.
// - **Ironclad Security (Authorization)**: The GET endpoint maintains its
//   excellent authorization check, ensuring users can only see their own
//   view data, unless they are an admin.
//
// ----------------------------------------------------------------------
//
// --- FUTURE ENHANCEMENTS (TODO) ---
// @free:
//   - [ ] Add pagination to the GET /user/:userId endpoint to handle users with many profile views.
// @premium:
//   - [ ] ✨ Provide analytics on the profile views, such as a chart showing views over time or a breakdown of the roles of the viewers (e.g., "You were viewed by 5 sellers and 3 buyers this week.").
// @wow:
//   - [ ] 🚀 Implement a "smart connection" suggestion. If two users view each other's profiles within a short period, send both a notification suggesting they connect via our messaging system.
// ----------------------------------------------------------------------

import { Router, Response } from 'express';
import { AuthenticatedRequest } from '@/middleware/auth';
import ProfileView from '@/models/ProfileView';
import auth from '@/middleware/auth';
import { createRateLimiter } from '@/middleware/rateLimiter';
import logger from '@/utils/logger';

const router = Router();

// --- Type Definitions ---
interface LogViewBody {
  viewedUserId: string;
  sourcePage?: string;
}

// POST a new profile view log
router.post(
  '/',
  auth,
  // ARCHITECTURAL UPGRADE: Abuse Prevention (Rate Limiting)
  createRateLimiter({ action: 'log_profile_view', limit: 20, window: 3600 }), // 20 views per hour
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { viewedUserId, sourcePage } = req.body as LogViewBody;
      const viewerUserId = req.user.id;

      // ARCHITECTURAL UPGRADE: Data Integrity (No Self-Views)
      if (viewerUserId === viewedUserId) {
        return res.status(400).json({ error: 'Cannot log a view on your own profile.' });
      }

      // TODO: Add Zod validation for the request body here

      const log = new ProfileView({
        viewedUserId,
        viewerUserId,
        sourcePage,
      });
      await log.save();
      res.status(201).json(log);
    } catch (err) {
      logger.error('Failed to log profile view:', err);
      res.status(500).json({ error: 'Failed to log profile view.' });
    }
  }
);

// GET recent profile views on a specific user (admin only or self)
router.get('/user/:userId', auth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = req.params;

    // This is a great example of our Ironclad Authorization standard
    if (req.user.role !== 'admin' && req.user.id !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const views = await ProfileView.find({ viewedUserId: userId })
      .sort({ createdAt: -1 })
      .limit(100)
      .populate('viewerUserId', 'username avatarUrl'); // Populate with viewer's public info

    res.json(views);
  } catch (err) {
    logger.error('Failed to fetch profile views:', err);
    res.status(500).json({ error: 'Failed to fetch profile views.' });
  }
});

export default router;