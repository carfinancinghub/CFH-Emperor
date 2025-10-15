// ----------------------------------------------------------------------
// File: Option.ts
// Path: backend/models/Option.ts
// Author: Gemini, System Architect
// Created: August 11, 2025 at 2:38 PM PDT
// Version: 2.0.0 (Competitive Bidding Enabled)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// Defines the Mongoose schema for the Option entity. This model now serves as
// the central hub for the competitive "Option-to-Purchase" bidding process.
//
// @architectural_notes
// - **Lifecycle-Driven**: The new 'status' enum ('BIDDING', 'ACTIVE', etc.)
//   creates a robust state machine for the option's lifecycle.
// - **Decoupled Bids**: The model holds a reference to the 'winningBid' but
//   does not store the bid details directly, keeping the models decoupled.
//
// @todos
// - @free:
//   - [ ] Add a database index to the 'listing' field for performance.
// - @premium:
//   - [ ] ✨ Add a 'biddingEndTime' field to allow for timed option auctions.
// - @wow:
//   - [ ] 🚀 Implement a feature to automatically notify previous bidders if an accepted option falls through and bidding re-opens.
//
// ----------------------------------------------------------------------

import { Schema, model, Document } from 'mongoose';

export interface IOption extends Document {
  listing: Schema.Types.ObjectId;
  seller: Schema.Types.ObjectId;
  status: 'BIDDING' | 'ACTIVE' | 'EXERCISED' | 'EXPIRED' | 'CANCELLED';
  // These fields are populated after a bid is accepted
  optionHolder?: Schema.Types.ObjectId;
  price?: number;
  expiresAt?: Date;
  winningBid?: Schema.Types.ObjectId;
}

const OptionSchema = new Schema<IOption>({
  listing: { type: Schema.Types.ObjectId, ref: 'Listing', required: true, unique: true },
  seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['BIDDING', 'ACTIVE', 'EXERCISED', 'EXPIRED', 'CANCELLED'], default: 'BIDDING' },
  optionHolder: { type: Schema.Types.ObjectId, ref: 'User' },
  price: { type: Number },
  expiresAt: { type: Date },
  winningBid: { type: Schema.Types.ObjectId, ref: 'OptionBid' },
}, { timestamps: true });

export default model<IOption>('Option', OptionSchema);