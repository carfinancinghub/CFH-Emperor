/*
 * File: vote.ts
 * Path: C:\CFH\backend\routes\disputes\vote.ts
 * Created: 2025-07-25 16:45 PDT
 * Author: Mini (AI Assistant)
 * Version: 1.0
 * Description: TypeScript conversion of the Express router for casting votes on disputes.
 * Artifact ID: route-dispute-vote
 * Version ID: route-dispute-vote-v1.0.0
 */

import express, { Request, Response } from 'express';
// import { Dispute } from '@models/Dispute'; // TODO: Create the Dispute Mongoose model
// import { authenticateUser } from '@middleware/authMiddleware'; // TODO: Implement auth middleware

// --- Type Definitions ---
type VoteOption = 'yes' | 'no' | 'neutral';
interface AuthenticatedRequest extends Request {
    user?: { id: string };
}

// --- Placeholder Mocks ---
const Dispute = {
    findById: async (id: string) => {
        if (id === 'dispute123') {
            return {
                assignedJudges: ['judge1', 'judge2'],
                votes: [{ arbitratorId: 'judge1', vote: 'yes' }],
                save: jest.fn().mockResolvedValue(true),
            };
        }
        return null;
    }
};
const auth = (req: AuthenticatedRequest, res: Response, next: Function) => {
    req.user = { id: 'judge2' };
    next();
};
// --- End Mocks ---

const router = express.Router();

// ✅ Cast a vote on an assigned dispute
router.post('/:id/vote', auth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const dispute = await Dispute.findById(req.params.id);
    if (!dispute) {
        return res.status(404).json({ msg: 'Dispute not found' });
    }

    // Only allow judges assigned to this dispute
    const assigned = dispute.assignedJudges || [];
    if (!req.user || !assigned.includes(req.user.id)) {
      return res.status(403).json({ msg: 'You are not assigned to this dispute' });
    }

    // Check if already voted
    const alreadyVoted = dispute.votes.find(v => v.arbitratorId.toString() === req.user!.id);
    if (alreadyVoted) {
        return res.status(400).json({ msg: 'You have already voted' });
    }

    const { vote, reason } = req.body as { vote: VoteOption; reason?: string };
    if (!['yes', 'no', 'neutral'].includes(vote)) {
      return res.status(400).json({ msg: 'Invalid vote option' });
    }

    dispute.votes.push({ arbitratorId: req.user.id, vote, reason });
    await dispute.save();
    res.json({ msg: 'Vote submitted successfully' });
  } catch (err) {
    console.error('❌ Vote error:', (err as Error).message);
    res.status(500).json({ msg: 'Server error' });
  }
});

export default router;
