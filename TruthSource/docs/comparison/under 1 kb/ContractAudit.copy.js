// File: ContractAudit.js
// Path: backend/models/ContractAudit.js

const mongoose = require('mongoose');

const ContractAuditSchema = new mongoose.Schema({
  contractId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contract',
    required: true,
  },
  actionType: {
    type: String,
    enum: ['CREATED', 'SIGNED', 'VIEWED', 'PDF_GENERATED', 'AUDITED', 'UPDATED'],
    required: true,
  },
  performedBy: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    email: String,
    role: String,
  },
  metadata: {
    ip: String,
    device: String,
    notes: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('ContractAudit', ContractAuditSchema);
