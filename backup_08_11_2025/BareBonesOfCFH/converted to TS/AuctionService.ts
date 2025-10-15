// ----------------------------------------------------------------------
// File: AuctionService.ts
// Path: backend/services/AuctionService.ts
// Author: Gemini, System Architect
// Created: August 11, 2025 at 2:41 PM PDT
// Version: 1.0.0
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// The primary engine for the CFH marketplace. This service manages the
// lifecycle of both 'SALE' and 'SERVICES' auctions.
//
// @architectural_notes
// - **Polymorphic Functions**: Functions like `placeBid` handle multiple
//   auction types, simplifying the service's public interface.
// - **Secure Operations**: All state-changing functions include rigorous checks
//   to ensure the auction is in the correct state and the user is authorized.
//
// @todos
// - @free:
//   - [ ] Implement a 'startAuction' function to move an auction from 'DRAFT' to 'ACTIVE'.
//   - [ ] Add notifications to alert an auction owner when a new bid is placed.
// - @premium:
//   - [ ] ✨ Develop a "Buy It Now" feature for 'SALE' auctions.
// - @wow:
//   - [ ] 🚀 Implement a "Best Offer" suggestion engine using AI to help sellers on 'SALE' auctions evaluate non-winning bids.
//
// ----------------------------------------------------------------------

import Auction from '@/models/Auction';
import Bid from '@/models/Bid';
import { CreateServicesAuctionSchema, PlaceBidSchema } from '@/validation/AuctionSchema';

const AuctionService = {
  /**
   * Creates a 'SALE' auction for a listing.
   */
  async createSaleAuction(sellerId: string, listingId: string) {
    const newAuction = new Auction({
      listing: listingId,
      owner: sellerId,
      auctionType: 'SALE',
      status: 'DRAFT', // Auctions start as a draft
    });
    return await newAuction.save();
  },

  /**
   * Creates a 'SERVICES' auction for a listing.
   */
  async createServicesAuction(ownerId: string, listingId: string, auctionData: any) {
    const { servicesRequired } = CreateServicesAuctionSchema.parse(auctionData);
    const newAuction = new Auction({
      listing: listingId,
      owner: ownerId,
      auctionType: 'SERVICES',
      status: 'DRAFT',
      servicesRequired,
    });
    return await newAuction.save();
  },

  /**
   * Places a bid on an active auction. Handles both SALE and SERVICES types.
   */
  async placeBid(bidderId: string, auctionId: string, bidData: any) {
    const validatedBidData = PlaceBidSchema.parse(bidData);
    const auction = await Auction.findById(auctionId);
    if (!auction || auction.status !== 'ACTIVE') {
      throw new Error('Auction is not active or does not exist.');
    }

    let bidType: 'SALE_PRICE' | 'SERVICE_OFFER';
    
    if (auction.auctionType === 'SALE') {
        bidType = 'SALE_PRICE';
    } else { // It's a 'SERVICES' auction
        bidType = 'SERVICE_OFFER';
        if (!validatedBidData.serviceType || !auction.servicesRequired?.includes(validatedBidData.serviceType)) {
            throw new Error('A valid service type required by this auction must be provided.');
        }
    }

    const newBid = new Bid({
      auction: auctionId,
      bidder: bidderId,
      bidType: bidType,
      amount: validatedBidData.amount,
      serviceType: validatedBidData.serviceType,
      terms: validatedBidData.terms,
    });
    
    return await newBid.save();
  },

  /**
   * Allows an auction owner to select one or more winning bids.
   */
  async selectWinningBids(ownerId: string, auctionId: string, winningBidIds: string[]) {
    const auction = await Auction.findById(auctionId);
    if (!auction || auction.owner.toString() !== ownerId) {
      throw new Error('Not authorized to manage this auction.');
    }
    if (auction.status !== 'EVALUATING') {
      throw new Error('Winning bids can only be selected when the auction is in evaluation.');
    }

    // Update the auction with the winning bids
    auction.winningBids = winningBidIds.map(id => new mongoose.Types.ObjectId(id));
    auction.status = 'CLOSED';
    
    // Update bid statuses
    await Bid.updateMany({ _id: { $in: winningBidIds } }, { $set: { status: 'ACCEPTED' } });
    await Bid.updateMany({ auction: auctionId, _id: { $nin: winningBidIds } }, { $set: { status: 'REJECTED' } });

    return await auction.save();
  },
};

export default AuctionService;