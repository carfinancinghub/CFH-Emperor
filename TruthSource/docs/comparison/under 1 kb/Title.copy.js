// File: Title.js
// Path: backend/models/Title.js

const mongoose = require('mongoose');

const TitleSchema = new mongoose.Schema({
  carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected', 'missing'],
    default: 'pending'
  },
  document: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Title', TitleSchema);
