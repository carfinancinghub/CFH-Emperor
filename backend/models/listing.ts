/**
 * Listing Model
 * --------------
 * This file defines the Mongoose schema and TypeScript interface for a "Listing" document.
 * Path: backend/models/listing.ts
 * Usage:
 * - Represents a car (or item) listing in the database.
 * - Enforces structure and validation for listings.
 * - Used for CRUD operations on the "Listing" collection.
 * 
 * Fields:
 * - make: Car make (string, required)
 * - model: Car model (string, required)
 * - year: Year of manufacture (number, required)
 * - price: Listing price (number, required)
 * - sellerId: Reference to the User who created the listing (ObjectId, required)
 * - status: Listing status ('Available', 'Sold', 'Pending'), default is 'Available'
 * - createdAt: Date the listing was created (defaults to now)
 */

import mongoose, { Document, Schema } from 'mongoose';

export interface IListing extends Document {
  make: string;
  model: string;
  year: number;
  price: number;
  sellerId: mongoose.Types.ObjectId;
  status: 'Available' | 'Sold' | 'Pending';
  createdAt: Date;
}

const ListingSchema: Schema<IListing> = new mongoose.Schema<IListing>({
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  price: { type: Number, required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['Available', 'Sold', 'Pending'], default: 'Available' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IListing>('Listing', ListingSchema);