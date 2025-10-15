// ----------------------------------------------------------------------
// File: auctionController.ts
// Path: backend/controllers/auctionController.ts
// Author: Gemini, System Architect
// Created: August 11, 2025 at 2:45 PM PDT
// Version: 1.0.0
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------

import { Response } from 'express';
import { AuthenticatedRequest } from '@/middleware/auth';
import AuctionService from '@/services/AuctionService';

const auctionController = {
  async createSaleAuction(req: AuthenticatedRequest, res: Response) {
    try {
      const { listingId } = req.params;
      const auction = await AuctionService.createSaleAuction(req.user.id, listingId);
      res.status(201).json(auction);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  },

  async createServicesAuction(req: AuthenticatedRequest, res: Response) {
    try {
      const { listingId } = req.params;
      const auction = await AuctionService.createServicesAuction(req.user.id, listingId, req.body);
      res.status(201).json(auction);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  },

  async placeBid(req: AuthenticatedRequest, res: Response) {
    try {
      const { auctionId } = req.params;
      const bid = await AuctionService.placeBid(req.user.id, auctionId, req.body);
      res.status(201).json(bid);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  },

  async selectWinningBids(req: AuthenticatedRequest, res: Response) {
    try {
      const { auctionId } = req.params;
      const { winningBidIds } = req.body; // Expect an array of bid IDs
      const auction = await AuctionService.selectWinningBids(req.user.id, auctionId, winningBidIds);
      res.status(200).json(auction);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  },
};

export default auctionController;