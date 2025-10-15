// File: votingController.ts
// Path: backend/controllers/disputes/votingController.ts
// ?? Cod1 Crown Certified - Voting Controller for Disputes

import { Request, Response } from 'express';
import Dispute from '@/models/dispute/Dispute';
import { triggerDisputeNotification } from '@/utils/notificationTrigger';
import { awardArbitratorBadge } from './arbitratorRecognition';
import { updateReputation } from '@/utils/reputationEngine';

interface Vote {
  voter: string;
  vote: string;
  timestamp: Date;
}

interface DisputeDocument {
  _id: string;
  votes: Vote[];
  timeline: { event: string; value: string; timestamp: Date }[];
  status: string;
  raisedBy: string;
  againstUserId: string;
  save: () => Promise<void>;
}

interface SocketIO {
  to: (room: string) => { emit: (event: string, data: any) => void };
}

export const castModeratorVote = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id: disputeId } = req.params;
    const { vote } = req.body;
    const voterId = req.user?.id;
    const io: SocketIO = req.app.get('socketio');

    const dispute: DisputeDocument | null = await Dispute.findById(disputeId);
    if (!dispute) {
      res.status(404).json({ error: 'Dispute not found' });
      return;
    }

    const existingVote = dispute.votes.find((v) => v.voter.toString() === voterId);
    if (existingVote) {
      res.status(400).json({ error: 'You have already voted' });
      return;
    }

    dispute.votes.push({ voter: voterId, vote, timestamp: new Date() });
    dispute.timeline.push({
      event: 'Vote Submitted',
      value: `${vote} by ${voterId}`,
      timestamp: new Date(),
    });

    await dispute.save();

    const yesVotes = dispute.votes.filter(v => v.vote === 'yes').length;
    const noVotes = dispute.votes.filter(v => v.vote === 'no').length;

    if (dispute.votes.length === 3 && (yesVotes === 3 || noVotes === 3)) {
      dispute.status = 'resolved';
      dispute.timeline.push({
        event: 'Dispute Resolved',
        value: `Unanimous ${yesVotes === 3 ? 'approval' : 'rejection'}`,
        timestamp: new Date(),
      });

      await awardArbitratorBadge(disputeId);
      await updateReputation(dispute.raisedBy, 'dispute-win');
      await updateReputation(dispute.againstUserId, 'dispute-loss');
      await dispute.save();

      io.to(disputeId).emit('dispute-resolved', dispute);
    } else {
      io.to(disputeId).emit('vote-cast', { voterId, vote });
    }

    await triggerDisputeNotification({
      type: 'Vote Submitted',
      disputeId,
      recipientId: [dispute.raisedBy, dispute.againstUserId],
      message: `A vote has been submitted on dispute ${disputeId}`,
      suppressDuplicates: true,
    });

    res.status(201).json({ message: 'Vote submitted' });
  } catch (error) {
    console.error('Voting error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const voteOnDispute = async (req: Request, res: Response): Promise<void> => {
  try {
    const { disputeId, vote } = req.body;
    const userId = req.user?.id;

    const dispute: DisputeDocument | null = await Dispute.findById(disputeId);
    if (!dispute) {
      res.status(404).json({ message: 'Dispute not found' });
      return;
    }

    dispute.votes.push({ voter: userId, vote, timestamp: new Date() });

    await dispute.save();

    res.status(201).json({ message: 'Vote recorded successfully.' });
  } catch (error) {
    console.error('voteOnDispute error:', error);
    res.status(500).json({ message: 'Server error recording vote' });
  }
};

/** TODO
 * - Implement additional validation for vote values.
 * - Consider adding logging for vote actions.
 * - Enhance error handling with more descriptive messages.
 */
