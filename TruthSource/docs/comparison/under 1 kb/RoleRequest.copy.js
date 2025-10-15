// File: RoleRequest.js
// Path: server/models/RoleRequest.js

const mongoose = require('mongoose');

const roleRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  requestedRoles: [
    {
      type: String,
      enum: ['mechanic', 'hauler', 'lender', 'storage_host', 'title_agent', 'insurer', 'admin'],
      required: true,
    }
  ],
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  reviewedAt: {
    type: Date,
  },
  rejectionReason: {
    type: String,
    maxlength: 2000,
  },
  notes: {
    type: String,
    maxlength: 2000,
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('RoleRequest', roleRequestSchema);
