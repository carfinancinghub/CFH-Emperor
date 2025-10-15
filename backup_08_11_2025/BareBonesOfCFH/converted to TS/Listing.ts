// ----------------------------------------------------------------------
// File: Listing.ts
// Path: backend/src/models/Listing.ts
// Author: Mini, System Architect
// Created: August 11, 2025 at 08:20 AM PDT
// Version: 2.0.0 (Architecturally Superior Version)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// The definitive Mongoose schema and model for the Listing entity, representing
// a vehicle for sale in our ecosystem.
//
// @architectural_notes
// - **Relational Data (Refs)**: The model uses Mongoose 'ref' properties to
//   create relationships with other models ('User', 'Auction'). This is our
//   standard for building an interconnected data layer.
// - **State Machine Enforcement**: The 'status' field uses an 'enum'. This
//   enforces our state machine logic at the database level, ensuring a listing
//   can only ever be in a valid, predefined state.
//
// @todos
// - @free:
//   - [ ] Add a geospatial index to the 'location' field for efficient location-based searches.
// - @premium:
//   - [ ] ✨ Add a 'featuredUntil' date field to support the "featured listing" premium feature.
// - @wow:
//   - [ ] 🚀 Add a 'vinData' field that can be automatically populated by integrating with a third-party VIN decoding service.
//
// ----------------------------------------------------------------------

import { Schema, model, Document } from 'mongoose';
import { IListing } from '@/types';

const ListingSchema = new Schema<IListing>({
  sellerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  price: { type: Number, required: true },
  vin: { type: String, unique: true },
  status: {
    type: String,
    enum: ['Draft', 'Pending Review', 'Available', 'In Auction', 'Sold'],
    default: 'Draft',
    index: true,
  },
  auctionId: { type: Schema.Types.ObjectId, ref: 'Auction' },
  // ... other fields like mileage, description, images, etc.
}, { timestamps: true });

export const Listing = model<IListing>('Listing', ListingSchema);