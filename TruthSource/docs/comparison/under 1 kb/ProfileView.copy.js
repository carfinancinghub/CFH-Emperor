// File: ProfileView.js
// Path: server/models/ProfileView.js

const mongoose = require('mongoose');

const profileViewSchema = new mongoose.Schema({
  viewedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  viewerUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  sourcePage: {
    type: String,
    maxlength: 200,
  },
  notes: {
    type: String,
    maxlength: 1000,
  }
}, {
  timestamps: true,
});

profileViewSchema.index({ viewedUserId: 1, viewerUserId: 1, timestamp: -1 });

module.exports = mongoose.model('ProfileView', profileViewSchema);
