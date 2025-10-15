// ----------------------------------------------------------------------
// File: TransactionService.ts
// Path: backend/services/TransactionService.ts
// Author: Gemini & SG Man, System Architects
// Created: August 10, 2025 at 15:00 PDT
// Version: 1.0.3 (Added Pending Rating Creation)
// ----------------------------------------------------------------------
// @description
// Service for finalizing auctions, creating transaction records, and triggering rating prompts.
//
// @architectural_notes
// - **Transaction-Coupled**: Creates `PendingRating` entries to prompt ratings post-finalization.
// - **Validated**: Ensures auction and bid validity before processing.
// - **Auditable**: Logs finalization to `HistoryService`.
//
// @dependencies mongoose @models/Transaction @models/Auction @models/PendingRating @services/HistoryService @services/PaymentProcessor
//
// @todos
// - @free:
//   - [x] Implement auction finalization.
//   - [x] Add pending rating creation.
// - @premium:
//   - [ ] ✨ Support partial payments.
// - @wow:
//   - [ ] 🚀 Integrate blockchain for transaction transparency.
// ----------------------------------------------------------------------
import { Types } from 'mongoose';
import Transaction, { ITransaction } from '@models/Transaction';
import Auction from '@models/Auction';
import PendingRating from '@models/PendingRating';
import HistoryService from '@services/HistoryService';
import PaymentProcessor from '@services/PaymentProcessor';

class TransactionError extends Error {
  status: number;
  constructor(message: string, status: number = 400) {
    super(message);
    this.status = status;
  }
}

const TransactionService = {
  async finalizeAuction(auctionId: string, adminId: string): Promise<ITransaction> {
    if (!Types.ObjectId.isValid(auctionId)) {
      throw new TransactionError('Invalid auction ID.', 400);
    }
    const auction = await Auction.findById(auctionId).populate('bids');
    if (!auction) {
      throw new TransactionError('Auction not found.', 404);
    }
    if (auction.status !== 'ACTIVE') {
      throw new TransactionError('Auction is not active.', 400);
    }

    const highestBid = auction.bids.reduce((max, bid) => bid.amount > max.amount ? bid : max, auction.bids[0]);
    if (!highestBid) {
      throw new TransactionError('No bids found for auction.', 400);
    }

    const paymentResult = await PaymentProcessor.processPayment({
      amount: highestBid.amount,
      bidderId: highestBid.bidder.toString(),
      sellerId: auction.seller.toString(),
    });

    const transaction = new Transaction({
      auction: auction._id,
      bidder: highestBid.bidder,
      seller: auction.seller,
      amount: highestBid.amount,
      paymentStatus: paymentResult.status,
      createdAt: new Date(),
    });

    await transaction.save();
    auction.status = 'FINALIZED';
    await auction.save();

    await PendingRating.create([
      { transaction: transaction._id, fromUser: transaction.seller, toUser: transaction.bidder },
      { transaction: transaction._id, fromUser: transaction.bidder, toUser: transaction.seller },
    ]);

    await HistoryService.logAction(adminId, 'FINALIZE_AUCTION', { auctionId, transactionId: transaction._id });
    return transaction;
  }
};

export default TransactionService;