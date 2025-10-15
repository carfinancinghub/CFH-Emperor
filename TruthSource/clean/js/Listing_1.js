// File: Listing.js
// Path: backend/models/seller/Listing.js
// 👑 Cod1 Crown Certified – Full-featured vehicle listing model

const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
  make: { type: String, required: true, index: true },
  model: { type: String, required: true, index: true },
  year: { type: Number, required: true },
  price: { type: Number, required: true },
  mileage: { type: Number },
  vin: { type: String, unique: true, sparse: true }, // Optional but unique when present

  description: { type: String, maxlength: 2000 },

  features: [{ type: String }], // e.g., ["sunroof", "navigation", "leather seats"]
  photos: [{ type: String }],   // URLs or file keys from cloud storage (e.g. S3, Cloudinary)

  location: {
    city: String,
    state: String,
    zip: String,
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },

  isApproved: { type: Boolean, default: false }, // For admin moderation
  isFeatured: { type: Boolean, default: false }, // For homepage or ad boosts
  isFinanced: { type: Boolean, default: false }, // Part of reverse-auction financing flow

  status: {
    type: String,
    enum: ['Available', 'Pending', 'Sold', 'Withdrawn', 'Rejected'],
    default: 'Available'
  },

  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  inspectionReport: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Inspection'
  },

  auctionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auction'
  },

  flags: [
    {
      reason: String,
      flaggedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      date: { type: Date, default: Date.now }
    }
  ],

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

ListingSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Listing', ListingSchema);