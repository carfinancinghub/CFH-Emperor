// ----------------------------------------------------------------------
// File: OptionBid.ts
// Path: backend/models/OptionBid.ts
// Author: Gemini, System Architect
// Created: August 11, 2025 at 2:38 PM PDT
// Version: 1.0.0
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// Defines the Mongoose schema for the OptionBid entity. This model captures
// a competitive offer made by a user to secure an "Option-to-Purchase".
//
// @architectural_notes
// - **Atomic Bids**: Each bid is a self-contained unit with its own status,
//   allowing for a clear and auditable bidding history.
// - **Clear Bid Components**: The schema has explicit fields for 'downpaymentAmount'
//   and 'holdDays', representing the two core levers of the option bidding strategy.
//
// ----------------------------------------------------------------------

import { Schema, model, Document } from 'mongoose';

export interface IOptionBid extends Document {
  option: Schema.Types.ObjectId;
  bidder: Schema.Types.ObjectId;
  downpaymentAmount: number;
  holdDays: number;
  status: 'ACTIVE' | 'RETRACTED' | 'ACCEPTED' | 'REJECTED';
}

const OptionBidSchema = new Schema<IOptionBid>({
  option: { type: Schema.Types.ObjectId, ref: 'Option', required: true },
  bidder: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  downpaymentAmount: { type: Number, required: true },
  holdDays: { type: Number, required: true },
  status: { type: String, enum: ['ACTIVE', 'RETRACTED', 'ACCEPTED', 'REJECTED'], default: 'ACTIVE' },
}, { timestamps: true });

export default model<IOptionBid>('OptionBid', OptionBidSchema);