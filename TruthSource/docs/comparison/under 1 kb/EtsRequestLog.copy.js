// File: EtsRequestLog.js
// Path: server/models/EtsRequestLog.js

const mongoose = require('mongoose');

const etsRequestLogSchema = new mongoose.Schema({
  service: {
    type: String,
    enum: ['GPS', 'AR', 'Voice', 'InsuranceAPI', 'Stripe', 'ContractPDF'],
    required: true,
  },
  endpoint: {
    type: String,
  },
  method: {
    type: String,
    enum: ['GET', 'POST', 'PUT', 'DELETE'],
    required: true,
  },
  requestBody: {
    type: Object,
  },
  responseStatus: {
    type: Number,
  },
  responseTimeMs: {
    type: Number,
  },
  success: {
    type: Boolean,
    default: true,
  },
  triggeredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  relatedEntityId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('EtsRequestLog', etsRequestLogSchema);
