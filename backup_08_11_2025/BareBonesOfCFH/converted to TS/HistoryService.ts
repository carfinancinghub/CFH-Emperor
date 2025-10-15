// ----------------------------------------------------------------------
// File: HistoryService.ts
// Path: backend/services/HistoryService.ts
// Author: Gemini, System Architect
// Created: August 11, 2025 at 19:12 PDT
// Version: 1.0.0
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// A dedicated service to aggregate and retrieve a user's offer and bid
// history from across the platform.
//
// @architectural_notes
// - **Read-Optimized**: This service is designed for complex read operations,
//   joining data from multiple collections to create a unified history view.
// - **Leverages Existing Models**: It does not require its own models, instead
//   it intelligently queries the existing 'Bid' and 'OptionBid' collections.
//
// @todos
// - @premium:
//   - [ ] ✨ Implement advanced filtering and pagination for all methods.
//   - [ ] ✨ Add logic for the "Export to CSV" feature.
//
// ----------------------------------------------------------------------

import Bid from '@/models/Bid';
import OptionBid from '@/models/OptionBid';
import Auction from '@/models/Auction';

const HistoryService = {
  /**
   * Retrieves all bids and option bids made by a specific user.
   */
  async getOffersMadeByUser(userId: string) {
    const serviceBids = await Bid.find({ bidder: userId }).populate({
      path: 'auction',
      select: 'listing',
      populate: { path: 'listing', select: 'make model year' }
    });
    
    const optionBids = await OptionBid.find({ bidder: userId }).populate({
      path: 'option',
      select: 'listing',
      populate: { path: 'listing', select: 'make model year' }
    });

    return { serviceBids, optionBids };
  },

  /**
   * Retrieves all bids received on auctions owned by a specific user.
   */
  async getOffersReceivedForUser(userId: string) {
    // Find all auctions where the user is the owner
    const userAuctions = await Auction.find({ owner: userId }).select('_id');
    const auctionIds = userAuctions.map(a => a._id);

    // Find all bids linked to those auctions
    const receivedBids = await Bid.find({ auction: { $in: auctionIds } }).populate('bidder', 'name profile.avatar');
    
    return receivedBids;
  }
};

export default HistoryService;