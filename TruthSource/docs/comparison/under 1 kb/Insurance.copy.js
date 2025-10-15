// File: Insurance.js
// Path: backend/models/Insurance.js

const mongoose = require('mongoose');

const BidSchema = new mongoose.Schema({
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  premium: Number,
  coverageType: String,
  durationMonths: Number,
  createdAt: { type: Date, default: Date.now }
});

const InsuranceSchema = new mongoose.Schema({
  carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  selectedBid: BidSchema,
  bidHistory: [BidSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Insurance', InsuranceSchema);
