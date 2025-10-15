// ----------------------------------------------------------------------
// File: Auction.ts
// Path: backend/models/Auction.ts
// Author: Gemini, System Architect
// Created: August 11, 2025 at 1:13 PM PDT
// Version: 1.0.0
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// Defines the Mongoose schema for the Auction entity. This is the core
// model for managing both standard vehicle sales and reverse-auctions for services.
//
// @architectural_notes
// - **Polymorphic Design**: The 'auctionType' field allows this single model
//   to handle two distinct business flows: 'SALE' and 'SERVICES'.
// - **Explicit Lifecycle**: The 'status' field provides a clear, state-machine
//   driven approach to managing the auction from creation to completion.
//
// @todos
// - @free:
//   - [ ] Add database indexes to 'status' and 'owner' for faster queries.
// - @premium:
//   - [ ] ✨ Add a 'watchers' field (an array of User refs) to allow users to "watch" an auction.
// - @wow:
//   - [ ] 🚀 Implement a 'history' field that logs every state change and major event for auditing.
//
// ----------------------------------------------------------------------

import { Schema, model, Document } from 'mongoose';

export interface IAuction extends Document {
  listing: Schema.Types.ObjectId;
  auctionType: 'SALE' | 'SERVICES';
  owner: Schema.Types.ObjectId;
  status: 'DRAFT' | 'ACTIVE' | 'EVALUATING' | 'CLOSED' | 'CANCELLED';
  servicesRequired?: ('FINANCING' | 'TRANSPORT' | 'INSURANCE' | 'ESCROW' | 'MECHANIC' | 'STORAGE')[];
  isAnonymous: boolean;
  startTime?: Date;
  endTime?: Date;
  winningBids?: Schema.Types.ObjectId[];
}

const AuctionSchema = new Schema<IAuction>({
  listing: { type: Schema.Types.ObjectId, ref: 'Listing', required: true },
  auctionType: { type: String, enum: ['SALE', 'SERVICES'], required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['DRAFT', 'ACTIVE', 'EVALUATING', 'CLOSED', 'CANCELLED'], default: 'DRAFT' },
  servicesRequired: [{ type: String, enum: ['FINANCING', 'TRANSPORT', 'INSURANCE', 'ESCROW', 'MECHANIC', 'STORAGE'] }],
  isAnonymous: { type: Boolean, default: false },
  startTime: { type: Date },
  endTime: { type: Date },
  winningBids: [{ type: Schema.Types.ObjectId, ref: 'Bid' }],
}, { timestamps: true });

export default model<IAuction>('Auction', AuctionSchema);