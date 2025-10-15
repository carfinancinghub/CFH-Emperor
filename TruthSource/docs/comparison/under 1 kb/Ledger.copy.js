const mongoose = require('mongoose');

const LedgerSchema = new mongoose.Schema({
  auctionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Auction' },
  escrowId: { type: mongoose.Schema.Types.ObjectId, ref: 'Escrow' },
  from: { type: String, required: true }, // 'buyer', 'platform', etc.
  to: { type: String, required: true },   // 'seller', 'inspector', etc.
  amount: { type: Number, required: true },
  purpose: { type: String, required: true }, // e.g. 'Vehicle Payment', 'Inspection Fee'
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ledger', LedgerSchema);
