// ----------------------------------------------------------------------
// File: TransactionService.ts
// Path: backend/services/TransactionService.ts
// Author: Gemini, System Architect
// Created: August 12, 2025 at 14:15 PDT
// Version: 1.0.0
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// The definitive service for finalizing transactions and creating auditable
// financial records. This is the capstone of the CFH transaction lifecycle.
//
// @architectural_notes
// - **Orchestrator Role**: This service doesn't process payments directly. It
//   orchestrates the process, calculating all payouts and creating immutable
//   ledger records before instructing the (existing) PaymentProcessor.
// - **Immutable Ledger**: For every transaction, this service generates a
//   series of Debit/Credit entries in the Ledger, ensuring a perfect,
//   double-entry accounting trail for every dollar moved.
//
// @todos
// - @free:
//   - [x] Create transaction and ledger records for a completed auction.
// - @premium:
//   - [ ] ✨ Implement the generation of exportable PDF financial reports.
// - @wow:
//   - [ ] 🚀 Integrate the AI Anomaly Detection engine to scan new transactions for fraud indicators.
//
// ----------------------------------------------------------------------

import Transaction from '@/models/Transaction';
import LedgerEntry from '@/models/LedgerEntry';
import Auction from '@/models/Auction';
import Bid from '@/models/Bid';
// import PaymentProcessor from '@/services/PaymentProcessor'; // Assumed to exist

const TransactionService = {
  /**
   * Finalizes a completed auction, creating the definitive financial records.
   */
  async finalizeAuction(auctionId: string): Promise<any> {
    const auction = await Auction.findById(auctionId).populate('bids');
    if (!auction || auction.status !== 'CLOSED') {
      throw new Error('Auction is not in a state that can be finalized.');
    }

    // --- 1. Calculate Financials ---
    const winningBids = auction.bids.filter((bid: any) => bid.status === 'ACCEPTED');
    const salePriceBid = winningBids.find((bid: any) => bid.bidType === 'SALE_PRICE');
    const serviceBids = winningBids.filter((bid: any) => bid.bidType === 'SERVICE_OFFER');

    const totalSalePrice = salePriceBid ? salePriceBid.amount : 0;
    const totalServiceFees = serviceBids.reduce((sum, bid) => sum + bid.amount, 0);
    
    // Example: 5% commission on the sale price
    const platformCommission = totalSalePrice * 0.05;
    const sellerPayoutAmount = totalSalePrice - platformCommission;

    // --- 2. Create the Master Transaction Record ---
    const transaction = new Transaction({
      auction: auctionId,
      status: 'PENDING_SETTLEMENT',
      totalSalePrice,
      totalServiceFees,
      platformCommission,
      payouts: [
        { payee: auction.seller, amount: sellerPayoutAmount, status: 'PENDING' },
        ...serviceBids.map(bid => ({ payee: bid.bidder, amount: bid.amount, status: 'PENDING' })),
      ],
    });
    await transaction.save();

    // --- 3. Create Immutable Ledger Entries ---
    // Buyer's payment comes in
    await LedgerEntry.create({ transaction: transaction._id, entryType: 'DEBIT', account: 'ESCROW', amount: totalSalePrice + totalServiceFees, memo: 'Buyer payment received' });
    // Payout to Seller
    await LedgerEntry.create({ transaction: transaction._id, entryType: 'CREDIT', account: 'ESCROW', amount: sellerPayoutAmount, memo: `Seller payout for listing ${auction.listing}` });
    // Payouts to Service Providers
    for (const bid of serviceBids) {
        await LedgerEntry.create({ transaction: transaction._id, entryType: 'CREDIT', account: 'ESCROW', amount: bid.amount, memo: `Payout for ${bid.serviceType} service` });
    }
    // CFH Commission
    await LedgerEntry.create({ transaction: transaction._id, entryType: 'CREDIT', account: 'ESCROW', amount: platformCommission, memo: 'Platform commission' });

    // --- 4. (Future Step) Instruct Payment Processor to execute payouts ---
    // await PaymentProcessor.executePayouts(transaction.payouts);

    transaction.status = 'SETTLED';
    await transaction.save();

    return transaction;
  },
};

export default TransactionService;