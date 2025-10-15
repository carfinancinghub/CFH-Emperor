// File: backend/models/Dispute.js

const mongoose = require('mongoose');

// Dispute schema to define dispute-related data
const disputeSchema = new mongoose.Schema({

  // Title of the dispute
  title: { type: String, required: true },

  // Optional description of the dispute
  description: { type: String },

  // Reference to the user who created the dispute
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // Status of the dispute, default is 'open' (can be 'resolved' later)
  status: { type: String, default: 'open', enum: ['open', 'resolved'] },

  // Resolution details, if the dispute is resolved
  resolution: { type: String },

}, { timestamps: true });  // Automatically adds createdAt and updatedAt fields

// Export the model to be used elsewhere in the application
module.exports = mongoose.model('Dispute', disputeSchema);