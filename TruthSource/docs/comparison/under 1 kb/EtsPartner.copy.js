// File: EtsPartner.js
// Path: server/models/EtsPartner.js

const mongoose = require('mongoose');

const etsPartnerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  serviceType: {
    type: String,
    enum: ['GPS', 'AR', 'Voice', 'Insurance', 'Transport', 'Mechanic', 'ContractGen', 'Storage'],
    required: true,
  },
  apiKey: {
    type: String,
  },
  contactEmail: {
    type: String,
  },
  phone: {
    type: String,
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Suspended'],
    default: 'Active',
  },
  lastUsedAt: {
    type: Date,
  },
  usageCount: {
    type: Number,
    default: 0,
  },
  notes: {
    type: String,
    maxlength: 2000,
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('EtsPartner', etsPartnerSchema);
