// ----------------------------------------------------------------------
// File: profileController.ts
// Path: backend/controllers/profileController.ts
// Author: Gemini & SG Man, System Architects
// Created: August 15, 2025 at 10:54 PDT
// Version: 1.0.1 (Added Zod Validation)
// ----------------------------------------------------------------------
// @description Controller for managing user profile data.
// ----------------------------------------------------------------------
import { Request, Response } from 'express';
import { z } from 'zod';
import User from '@/models/User';
import Listing from '@/models/Listing';
import Auction from '@/models/Auction';
import HistoryService from '@/services/HistoryService';

const ProfileUpdateSchema = z.object({
  bio: z.string().max(500).optional(),
  avatar: z.string().url().optional(),
  location: z.string().max(100).optional(),
});

const profileController = {
  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const userProfile = await User.findById(userId);
      const userListings = await Listing.find({ seller: userId, status: 'ACTIVE' });
      const userBids = await Auction.find({ 'bids.bidder': userId }).select('listing.make listing.model bids.$');

      await HistoryService.logAction(userId, 'VIEW_PROFILE', { userId });
      res.status(200).json({
        profile: userProfile,
        listings: userListings,
        bids: userBids,
      });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to fetch profile data.' });
    }
  },

  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const validatedData = ProfileUpdateSchema.parse(req.body);
      const { bio, avatar, location } = validatedData;

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: { bio, avatar, location } },
        { new: true, runValidators: true }
      );

      await HistoryService.logAction(userId, 'UPDATE_PROFILE', { userId });
      res.status(200).json(updatedUser);
    } catch (error: any) {
      res.status(error instanceof z.ZodError ? 400 : 500).json({ error: error.message });
    }
  },
};

export default profileController;