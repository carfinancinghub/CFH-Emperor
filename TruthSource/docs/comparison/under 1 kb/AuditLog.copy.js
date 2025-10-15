// File: AuditLog.js
// Path: backend/models/AuditLog.js

const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  contractId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contract', required: true },
  action: { type: String, required: true }, // e.g., "approved", "rejected", "commented", "exported"
  performedBy: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    email: String,
    role: String
  },
  note: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AuditLog', AuditLogSchema);
