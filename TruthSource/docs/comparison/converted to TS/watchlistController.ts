// ----------------------------------------------------------------------
// File: watchlistController.ts
// Path: backend/controllers/watchlistController.ts
// Author: Gemini & SG Man, System Architects
// Created: August 15, 2025 at 11:21 PDT
// Version: 1.0.1 (Added Validation)
// ----------------------------------------------------------------------
// @description Controller for managing user auction watchlists.
// ----------------------------------------------------------------------
import { Request, Response } from 'express';
import { z } from 'zod';
import User from '@/models/User';
import Auction from '@/models/Auction';
import HistoryService from '@/services/HistoryService';
import mongoose from 'mongoose';

const AuctionIdSchema = z.string().refine((id) => mongoose.isValidObjectId(id), { message: 'Invalid auction ID' });

const watchlistController = {
  async getWatchlist(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const user = await User.findById(userId).populate({
        path: 'watchlist',
        populate: { path: 'listing', select: 'make model year photos price' },
      });
      
      await HistoryService.logAction(userId, 'VIEW_WATCHLIST', { count: user?.watchlist.length || 0 });
      res.status(200).json(user?.watchlist || []);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to fetch watchlist.' });
    }
  },

  async addToWatchlist(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { auctionId } = AuctionIdSchema.parse(req.params);
      const auction = await Auction.findById(auctionId);
      if (!auction) throw new Error('Auction not found');

      await User.findByIdAndUpdate(userId, { $addToSet: { watchlist: auctionId } });
      await HistoryService.logAction(userId, 'ADD_WATCHLIST', { auctionId });
      res.status(200).json({ message: 'Auction added to watchlist.' });
    } catch (error: any) {
      res.status(error instanceof z.ZodError ? 400 : 404).json({ error: error.message });
    }
  },
  
  async removeFromWatchlist(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { auctionId } = AuctionIdSchema.parse(req.params);

      await User.findByIdAndUpdate(userId, { $pull: { watchlist: auctionId } });
      await HistoryService.logAction(userId, 'REMOVE_WATCHLIST', { auctionId });
      res.status(200).json({ message: 'Auction removed from watchlist.' });
    } catch (error: any) {
      res.status(error instanceof z.ZodError ? 400 : 500).json({ error: error.message });
    }
  },
};

export default watchlistController;