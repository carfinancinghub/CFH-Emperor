// ----------------------------------------------------------------------
// File: disputeController.ts
// Path: backend/controllers/disputeController.ts
// Author: Gemini, System Architect
// Created: August 11, 2025 at 16:57 PDT
// Version: 1.0.0
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// The API controller for the Dispute Resolution System. It handles all
// HTTP requests for creating, viewing, and updating disputes.
//
// ----------------------------------------------------------------------

import { Response } from 'express';
import { AuthenticatedRequest } from '@/middleware/auth';
import DisputeService from '@/services/DisputeService';
import Dispute from '@/models/Dispute';
import DisputeMessage from '@/models/DisputeMessage';

const disputeController = {
  async openDispute(req: AuthenticatedRequest, res: Response) {
    try {
      const dispute = await DisputeService.openDispute(req.user.id, req.body);
      res.status(201).json(dispute);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  },

  async addMessage(req: AuthenticatedRequest, res: Response) {
    try {
      const { disputeId } = req.params;
      const message = await DisputeService.addMessageToDispute(disputeId, req.user.id, req.body);
      res.status(201).json(message);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  },

  async changeStatus(req: AuthenticatedRequest, res: Response) {
    try {
      const { disputeId } = req.params;
      const { status } = req.body;
      const dispute = await DisputeService.changeDisputeStatus(disputeId, status);
      res.status(200).json(dispute);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  },
  
  async getDisputeById(req: AuthenticatedRequest, res: Response) {
    try {
        const { disputeId } = req.params;
        const dispute = await Dispute.findById(disputeId).populate('complainant defendant', 'name profile.avatar');
        const messages = await DisputeMessage.find({ dispute: disputeId }).populate('author', 'name profile.avatar').populate('attachments');
        
        if (!dispute) {
            return res.status(404).json({ message: 'Dispute not found.'});
        }
        // Auth check to ensure user is part of the dispute or an admin would go here

        res.status(200).json({ dispute, messages });
    } catch (err: any) {
        res.status(500).json({ message: 'Failed to retrieve dispute details.', error: err.message });
    }
  }
};

export default disputeController;