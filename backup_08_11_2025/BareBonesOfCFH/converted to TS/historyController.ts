// ----------------------------------------------------------------------
// File: historyController.ts
// Path: backend/controllers/historyController.ts
// Author: Gemini, System Architect
// Created: August 11, 2025 at 19:12 PDT
// Version: 1.0.0
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------

import { Response } from 'express';
import { AuthenticatedRequest } from '@/middleware/auth';
import HistoryService from '@/services/HistoryService';

const historyController = {
  async getOffersMade(req: AuthenticatedRequest, res: Response) {
    try {
      const history = await HistoryService.getOffersMadeByUser(req.user.id);
      res.status(200).json(history);
    } catch (err: any) {
      res.status(500).json({ message: 'Failed to retrieve offers made.' });
    }
  },

  async getOffersReceived(req: AuthenticatedRequest, res: Response) {
    try {
      const history = await HistoryService.getOffersReceivedForUser(req.user.id);
      res.status(200).json(history);
    } catch (err: any) {
      res.status(500).json({ message: 'Failed to retrieve offers received.' });
    }
  },
};

export default historyController;