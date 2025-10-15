// ----------------------------------------------------------------------
// File: LedgerEntry.ts
// Path: backend/models/LedgerEntry.ts
// Author: Gemini, System Architect
// Created: August 11, 2025 at 18:55 PDT
// Version: 1.0.0
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// Defines the Mongoose schema for an immutable LedgerEntry. This provides
// a detailed, auditable, double-entry accounting record for every transaction.
//
// @architectural_notes
// - **Immutable by Design**: This collection should be treated as immutable.
//   Entries are created, but never updated or deleted, to ensure a perfect
//   audit trail. Corrections are made by adding new, reversing entries.
// - **AI Ready**: This ledger will be the primary data source for our "Wow++"
//   AI-powered fraud and anomaly detection engine.
//
// ----------------------------------------------------------------------

import { Schema, model, Document } from 'mongoose';

export interface ILedgerEntry extends Document {
  transaction: Schema.Types.ObjectId;
  entryType: 'DEBIT' | 'CREDIT';
  account: string; // e.g., 'ESCROW', 'SELLER_PAYABLE', 'CFH_REVENUE', 'LENDER_PAYABLE'
  amount: number;
  memo?: string;
}

const LedgerEntrySchema = new Schema<ILedgerEntry>({
  transaction: { type: Schema.Types.ObjectId, ref: 'Transaction', required: true, index: true },
  entryType: { type: String, enum: ['DEBIT', 'CREDIT'], required: true },
  account: { type: String, required: true },
  amount: { type: Number, required: true },
  memo: { type: String },
}, { timestamps: true });

export default model<ILedgerEntry>('LedgerEntry', LedgerEntrySchema);