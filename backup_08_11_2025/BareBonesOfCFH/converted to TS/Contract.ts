// ----------------------------------------------------------------------
// File: Contract.ts
// Path: backend/models/Contract.ts
// Author: Gemini, System Architect
// Created: August 11, 2025 at 4:30 PM PDT
// Version: 1.0.0
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// Defines the Mongoose schema for the Contract entity. This model serves
// as the definitive record for all legally binding documents on the platform.
//
// @architectural_notes
// - **Auditable & Versioned**: Includes a 'versions' array to maintain a
//   complete history of the document, which is critical for legal auditing.
// - **Role-Based Parties**: The 'parties' array explicitly defines each user's
//   role within the contract (e.g., 'Seller', 'Buyer'), providing clarity.
//
// @todos
// - @free:
//   - [ ] Add a database index to the 'parties.user' field to quickly find all contracts for a specific user.
// - @premium:
//   - [ ] ✨ Integrate a 'statusWebhookUrl' field for real-time updates from the e-signature provider.
// - @wow:
//   - [ ] 🚀 Add a 'clauses' field that stores a structured list of key clauses extracted by our AI analysis feature.
//
// ----------------------------------------------------------------------

import { Schema, model, Document } from 'mongoose';

export interface IContract extends Document {
  auction: Schema.Types.ObjectId;
  parties: {
    user: Schema.Types.ObjectId;
    role: 'Seller' | 'Buyer' | 'Lender' | 'Hauler' | 'Mechanic';
  }[];
  documentType: 'BILL_OF_SALE' | 'SERVICE_AGREEMENT' | 'OPTION_AGREEMENT';
  status: 'DRAFT' | 'PENDING_SIGNATURE' | 'EXECUTED' | 'VOIDED';
  documentUrl?: string;
  documentKey?: string; // For S3 deletions
  eSignEnvelopeId?: string; // From e-signature provider
  versions: {
    version: number;
    url: string;
    createdAt: Date;
  }[];
}

const ContractSchema = new Schema<IContract>({
  auction: { type: Schema.Types.ObjectId, ref: 'Auction', required: true },
  parties: [
    {
      user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      role: { type: String, required: true },
    },
  ],
  documentType: {
    type: String,
    enum: ['BILL_OF_SALE', 'SERVICE_AGREEMENT', 'OPTION_AGREEMENT'],
    required: true,
  },
  status: {
    type: String,
    enum: ['DRAFT', 'PENDING_SIGNATURE', 'EXECUTED', 'VOIDED'],
    default: 'DRAFT',
  },
  documentUrl: { type: String },
  documentKey: { type: String },
  eSignEnvelopeId: { type: String },
  versions: [
    {
      version: { type: Number, required: true },
      url: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
}, { timestamps: true });

export default model<IContract>('Contract', ContractSchema);