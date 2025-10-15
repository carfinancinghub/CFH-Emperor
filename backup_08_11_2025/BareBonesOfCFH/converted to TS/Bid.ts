// ----------------------------------------------------------------------
// File: Bid.ts
// Path: backend/models/Bid.ts
// Author: Gemini, System Architect
// Created: August 11, 2025 at 1:13 PM PDT
// Version: 1.0.0
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// Defines the Mongoose schema for the Bid entity. This model captures offers
// from buyers in a 'SALE' auction and from service providers in a 'SERVICES' auction.
//
// ----------------------------------------------------------------------

import { Schema, model, Document } from 'mongoose';

export interface IBid extends Document {
  auction: Schema.Types.ObjectId;
  bidder: Schema.Types.ObjectId; // A buyer or a service provider
  bidType: 'SALE_PRICE' | 'SERVICE_OFFER';
  serviceType?: 'FINANCING' | 'TRANSPORT' | 'INSURANCE' | 'ESCROW' | 'MECHANIC' | 'STORAGE';
  amount: number;
  terms?: string;
  status: 'SUBMITTED' | 'RETRACTED' | 'ACCEPTED' | 'REJECTED';
}

const BidSchema = new Schema<IBid>({
  auction: { type: Schema.Types.ObjectId, ref: 'Auction', required: true },
  bidder: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  bidType: { type: String, enum: ['SALE_PRICE', 'SERVICE_OFFER'], required: true },
  serviceType: {
    type: String,
    enum: ['FINANCING', 'TRANSPORT', 'INSURANCE', 'ESCROW', 'MECHANIC', 'STORAGE'],
    required: function(this: IBid) {
      return this.bidType === 'SERVICE_OFFER';
    }
  },
  amount: { type: Number, required: true },
  terms: { type: String },
  status: { type: String, enum: ['SUBMITTED', 'RETRACTED', 'ACCEPTED', 'REJECTED'], default: 'SUBMITTED' },
}, { timestamps: true });

export default model<IBid>('Bid', BidSchema);