// ----------------------------------------------------------------------
// File: OptionService.ts
// Path: backend/services/OptionService.ts
// Author: Gemini, System Architect
// Created: August 11, 2025 at 2:39 PM PDT
// Version: 1.0.0
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// The definitive service for managing the competitive "Option-to-Purchase"
// lifecycle, from creation and bidding to final acceptance.
//
// @architectural_notes
// - **Transactional Logic**: The `acceptOptionBid` function is designed to
//   be transactional, updating multiple documents (Option, OptionBids) in a
//   single, logical operation.
// - **State Machine Enforcement**: Each function validates the current status
//   of the Option before proceeding, ensuring a robust state machine.
//
// @todos
// - @free:
//   - [ ] Add notifications to alert the seller when a new option bid is placed.
// - @premium:
//   - [ ] ✨ Implement logic to handle counter-offers from the seller to a bidder.
// - @wow:
//   - [ ] 🚀 Use a transaction session (e.g., MongoDB transactions) in `acceptOptionBid` to ensure all database updates succeed or fail together.
//
// ----------------------------------------------------------------------

import Option from '@/models/Option';
import OptionBid from '@/models/OptionBid';
import Listing from '@/models/Listing';
import { PlaceOptionBidSchema } from '@/validation/OptionSchema';

const OptionService = {
  /**
   * Puts a listing up for Option bidding.
   */
  async createOptionForListing(sellerId: string, listingId: string) {
    const existingOption = await Option.findOne({ listing: listingId });
    if (existingOption) {
      throw new Error('An option for this listing already exists.');
    }

    const newOption = new Option({
      listing: listingId,
      seller: sellerId,
      status: 'BIDDING',
    });

    await newOption.save();
    return newOption;
  },

  /**
   * Allows a user to place a competitive bid on an active Option.
   */
  async placeBidOnOption(bidderId: string, optionId: string, bidData: any) {
    const validatedData = PlaceOptionBidSchema.parse(bidData);
    
    const option = await Option.findById(optionId);
    if (!option || option.status !== 'BIDDING') {
      throw new Error('This option is not currently open for bidding.');
    }

    const newBid = new OptionBid({
      option: optionId,
      bidder: bidderId,
      downpaymentAmount: validatedData.downpaymentAmount,
      holdDays: validatedData.holdDays,
    });

    await newBid.save();
    return newBid;
  },

  /**
   * Allows a seller to accept a winning bid on an Option.
   */
  async acceptOptionBid(sellerId: string, optionBidId: string) {
    const winningBid = await OptionBid.findById(optionBidId);
    if (!winningBid) throw new Error('Bid not found.');

    const option = await Option.findById(winningBid.option);
    if (!option || option.seller.toString() !== sellerId) {
      throw new Error('Not authorized to accept bids for this option.');
    }
    if (option.status !== 'BIDDING') {
      throw new Error('Option is not in a bidding state.');
    }

    // Step 1: Reject all other bids for this option
    await OptionBid.updateMany(
      { option: option._id, _id: { $ne: optionBidId } },
      { $set: { status: 'REJECTED' } }
    );

    // Step 2: Update the winning bid's status
    winningBid.status = 'ACCEPTED';
    await winningBid.save();

    // Step 3: Update the main Option document with the winner's details
    option.status = 'ACTIVE';
    option.winningBid = winningBid._id;
    option.optionHolder = winningBid.bidder;
    option.price = winningBid.downpaymentAmount;
    option.expiresAt = new Date(Date.now() + winningBid.holdDays * 24 * 60 * 60 * 1000);
    
    await option.save();
    return option;
  },
};

export default OptionService;