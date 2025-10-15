// Converted from Lender.js — 2025-08-22T01:45:30.668006+00:00
// File: Lender.js
// Path: backend/models/lender/Lender.js
// 👑 Cod1 Crown Certified — Lender Entity

const mongoose = require('mongoose');

const LenderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyName: { type: String, required: true },
  licenseNumber: { type: String },
  fundingLimit: { type: Number, default: 0 },
  approved: { type: Boolean, default: false },
  specializations: {
    type: [String],
    enum: ['fico', 'equity', 'ira', 'fleet', 'refinance'],
    default: ['fico']
  },
  activeLoans: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Loan' }],
}, {
  timestamps: true
});

module.exports = mongoose.model('Lender', LenderSchema);
