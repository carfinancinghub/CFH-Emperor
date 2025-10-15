// ----------------------------------------------------------------------
// File: Listing.ts
// Path: backend/src/models/Listing.ts
// Author: Gemini & SG Man, System Architects
// Created: August 12, 2025 at 17:15 PDT
// Version: 2.0.1 (Merged Implementation)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// Mongoose model for vehicle listings created by sellers, integrated with auctions.
//
// @architectural_notes
// - **Relational Data**: Uses Mongoose refs to User, Photo, and Auction models.
// - **State Machine**: Enforces a granular status enum at the database level.
// - **Optimized**: Indexes on seller, status, and vin (unique) for performance.
// - **Complete**: Includes all fields for listing creation and display.
//
// @todos
// - @free:
//   - [x] Add basic listing model with auction integration.
//   - [ ] Add geospatial index to location field for searches.
// - @premium:
//   - [ ] ✨ Add featuredUntil field for premium listings.
//   - [ ] ✨ Add fields for listing analytics.
// - @wow:
//   - [ ] 🚀 Add vinData field with third-party VIN decoding.
//
// ----------------------------------------------------------------------
import mongoose, { Schema, Document } from 'mongoose';

export interface IListing extends Document {
  seller: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  price: number;
  description: string;
  photos: string[];
  status: 'Draft' | 'Pending Review' | 'Available' | 'In Auction' | 'Sold';
  auctionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ListingSchema = new Schema<IListing>(
  {
    seller: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    vin: { type: String, required: true, minlength: 17, maxlength: 17, unique: true },
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true, min: 1900, max: 2026 },
    mileage: { type: Number, required: true, min: 0 },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, maxlength: 1000 },
    photos: [{ type: Schema.Types.ObjectId, ref: 'Photo' }],
    status: {
      type: String,
      enum: ['Draft', 'Pending Review', 'Available', 'In Auction', 'Sold'],
      default: 'Draft',
      index: true,
    },
    auctionId: { type: Schema.Types.ObjectId, ref: 'Auction' },
  },
  { timestamps: true }
);

export default mongoose.model<IListing>('Listing', ListingSchema);