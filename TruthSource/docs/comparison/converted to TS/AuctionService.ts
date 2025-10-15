// ----------------------------------------------------------------------
// File: AuctionService.ts
// Path: backend/services/AuctionService.ts
// Author: Gemini & SG Man, System Architects
// Created: August 12, 2025 at 09:28 PDT
// Version: 1.2.5 (Integrated with NotificationService)
// ----------------------------------------------------------------------
// @description Core service for managing auctions with advanced filtering and notifications.
// @dependencies @models/Auction @services/HistoryService @services/NotificationService mongoose zod
// ----------------------------------------------------------------------
import Auction, { IAuction } from '@models/Auction';
import HistoryService from '@services/HistoryService';
import NotificationService from '@services/NotificationService';
import mongoose from 'mongoose';
import { z } from 'zod';

class AuctionError extends Error {
  status: number;
  constructor(message: string, status: number = 400) {
    super(message);
    this.status = status;
  }
}

const AuctionFilterSchema = z.object({
  limit: z.number().min(1).max(100).optional().default(20),
  page: z.number().min(1).optional().default(1),
  type: z.enum(['SALE', 'SERVICES']).optional(),
  make: z.string().optional(),
  model: z.string().optional(),
  yearMin: z.coerce.number().int().min(1900).optional(),
  yearMax: z.coerce.number().int().max(new Date().getFullYear() + 1).optional(),
  maxPrice: z.coerce.number().positive().optional(),
});

const AuctionService = {
  async getActiveAuctions(options: z.infer<typeof AuctionFilterSchema> = {}): Promise<IAuction[]> {
    const { limit, page, type, make, model, yearMin, yearMax, maxPrice } = AuctionFilterSchema.parse(options);
    const query: any = { status: 'ACTIVE' };
    if (type) query.auctionType = type;
    if (make) query['listing.make'] = { $regex: make, $options: 'i' };
    if (model) query['listing.model'] = { $regex: model, $options: 'i' };
    if (yearMin || yearMax) {
      query['listing.year'] = {};
      if (yearMin) query['listing.year'].$gte = yearMin;
      if (yearMax) query['listing.year'].$lte = yearMax;
    }
    if (maxPrice) query['listing.price'] = { $lte: maxPrice };

    const auctions = await Auction.find(query)
      .populate({
        path: 'listing',
        select: 'make model year price photos',
        populate: { path: 'photos', select: 'url metadata' },
      })
      .sort({ endTime: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .hint({ status: 1, 'listing.make': 1, 'listing.year': 1, 'listing.price': 1 });

    HistoryService.logAction('anonymous', 'SEARCH_AUCTIONS', { page, limit, type, make, model, yearMin, yearMax, maxPrice }).catch(console.error);
    return auctions;
  },

  async getAuctionById(auctionId: string, userId?: string): Promise<IAuction> {
    if (!mongoose.isValidObjectId(auctionId)) {
      throw new AuctionError('Invalid auction ID.', 400);
    }
    const auction = await Auction.findById(auctionId)
      .populate({
        path: 'listing',
        populate: [
          { path: 'photos', select: 'url metadata' },
          { path: 'seller', select: 'name profile.avatar reputation' },
        ],
      })
      .populate({
        path: 'bids',
        populate: { path: 'bidder', select: 'name businessName reputation' },
      });

    if (!auction) {
      throw new AuctionError('Auction not found.', 404);
    }

    if (auction.auctionType === 'SEALED_BID' && userId !== auction.seller?.toString()) {
      auction.bids = [];
    }

    HistoryService.logAction(userId || 'anonymous', 'VIEW_AUCTION_DETAILS', { auctionId }).catch(console.error);
    return auction;
  },

  async placeBid(auctionId: string, userId: string, amount: number): Promise<any> {
    if (!mongoose.isValidObjectId(auctionId)) {
      throw new AuctionError('Invalid auction ID.', 400);
    }
    const auction = await Auction.findById(auctionId);
    if (!auction) {
      throw new AuctionError('Auction not found.', 404);
    }
    if (auction.status !== 'ACTIVE') {
      throw new AuctionError('Auction is not active.', 400);
    }
    const bid = {
      _id: new mongoose.Types.ObjectId(),
      bidder: new mongoose.Types.ObjectId(userId),
      amount,
      createdAt: new Date(),
    };
    auction.bids.push(bid);
    await auction.save();

    try {
      await NotificationService.notifyWatchersOfNewBid(auctionId, amount);
    } catch (error) {
      console.error(`Failed to send bid notification for auction ${auctionId}:`, error);
    }

    return bid;
  }
};

export default AuctionService;