const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  price: { type: Number, required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['Available', 'Sold', 'Pending'], default: 'Available' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Listing', ListingSchema);