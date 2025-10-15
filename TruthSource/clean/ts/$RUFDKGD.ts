// Converted from $RUFDKGD.js — 2025-08-22T16:23:51.406387+00:00
// File: index.js
// Path: backend/routes/auctions/index.js

const express = require('express');
const router = express.Router();
const {
  getAllActiveAuctions,
  getAuctionById,
  createAuction,
  submitBid,
  closeAuctionIfExpired,
} = require('../../controllers/auction/auctionController');

// Routes
router.get('/', getAllActiveAuctions);
router.get('/:auctionId', getAuctionById);
router.post('/', createAuction);
router.post('/:auctionId/bid', submitBid);
router.post('/:auctionId/close', closeAuctionIfExpired); // optional manual override

module.exports = router;
