// ----------------------------------------------------------------------
// File: Transaction.ts
// Path: backend/models/Transaction.ts
// Author: Gemini, System Architect
// Created: August 11, 2025 at 18:55 PDT
// Version: 1.0.0
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// Defines the Mongoose schema for the Transaction entity. This model is the
// definitive financial record for a completed auction.
//
// @architectural_notes
// - **Orchestration Hub**: This model serves as the central hub for the
//   payment orchestration process, tracking the overall status and all
//   associated payouts.
// - **Clear Financial Summary**: Provides a top-level summary of all key
//   financial figures for a given deal, from sale price to platform commission.
//
// @todos
// - @premium:
//   - [ ] ✨ Add integration with our accounting software sync feature.
//
// ----------------------------------------------------------------------

import { Schema, model, Document } from 'mongoose';

export interface ITransaction extends Document {
  auction: Schema.Types.ObjectId;
  status: 'PENDING_SETTLEMENT' | 'SETTLED' | 'FAILED' | 'REFUNDED';
  totalSalePrice: number;
  totalServiceFees: number;
  platformCommission: number;
  payouts: {
    payee: Schema.Types.ObjectId;
    amount: number;
    status: string;
    payoutId?: string; // ID from the payment processor
  }[];
}

const TransactionSchema = new Schema<ITransaction>({
  auction: { type: Schema.Types.ObjectId, ref: 'Auction', required: true, unique: true },
  status: { type: String, enum: ['PENDING_SETTLEMENT', 'SETTLED', 'FAILED', 'REFUNDED'], default: 'PENDING_SETTLEMENT' },
  totalSalePrice: { type: Number, required: true },
  totalServiceFees: { type: Number, required: true },
  platformCommission: { type: Number, required: true },
  payouts: [{
    payee: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    status: { type: String, required: true },
    payoutId: { type: String },
  }],
}, { timestamps: true });

export default model<ITransaction>('Transaction', TransactionSchema);