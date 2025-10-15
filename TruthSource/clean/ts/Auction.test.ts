/**
 * CFH Automotive Ecosystem
 * Crown Certified TypeScript Module
 * 
 * This module defines the Auction schema for the CFH Automotive Ecosystem.
 * It utilizes Mongoose for MongoDB interactions.
 */

import mongoose, { Document, Model, Schema } from 'mongoose';

interface IAuction extends Document {
  car: mongoose.Types.ObjectId;
  seller: mongoose.Types.ObjectId;
  startPrice: number;
  currentBid?: number;
  status: 'open' | 'closed' | 'pending';
  createdAt: Date;
  endsAt: Date;
}

const auctionSchema: Schema<IAuction> = new mongoose.Schema({
  car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startPrice: { type: Number, required: true },
  currentBid: { type: Number },
  status: { type: String, enum: ['open', 'closed', 'pending'], default: 'open' },
  createdAt: { type: Date, default: Date.now },
  endsAt: { type: Date, required: true },
});

const Auction: Model<IAuction> = mongoose.model<IAuction>('Auction', auctionSchema);

export default Auction;

/** TODO */
// - Consider adding validation for the `endsAt` field to ensure it is a future date.
// - Implement business logic for updating `currentBid` and `status` based on auction events.
