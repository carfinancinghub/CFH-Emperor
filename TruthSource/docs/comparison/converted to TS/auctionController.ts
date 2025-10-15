// ----------------------------------------------------------------------
// File: auctionController.ts
// Path: backend/controllers/auctionController.ts
// Author: Gemini & SG Man, System Architects
// Created: August 10, 2025 at 14:00 PDT
// Version: 1.2.5 (Handles Advanced Search Query Params)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// Controller for handling auction API requests, now processing advanced search filters.
//
// ... (metadata unchanged)
//
// ----------------------------------------------------------------------
import { Request, Response } from 'express';
import { z } from 'zod';
import AuctionService from '@/services/AuctionService';
import HistoryService from '@/services/HistoryService';
import { PlaceBidSchema } from '@/validation/PlaceBidSchema';

const auctionController = {
  async getAuctions(req: Request, res: Response): Promise<void> {
    const userId = req.user?.id;
    try {
      // Pass the entire query object to the service for validation and processing
      const auctions = await AuctionService.getActiveAuctions(req.query);
      res.status(200).json(auctions);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Invalid filter parameters', details: error.errors });
      } else {
        await HistoryService.logAction(userId, 'SEARCH_AUCTIONS_FAILED', { error: error.message });
        res.status(500).json({ error: 'Failed to fetch auctions' });
      }
    }
  },

  // ... (getAuctionById and placeBid methods are unchanged)
};

export default auctionController;