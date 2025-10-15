// Converted from $RYQ7HP5.js — 2025-08-22T16:23:51.440766+00:00
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
try {
const auctions = await Auction.find();
res.json(auctions);
} catch (error) {
res.status(500).json({ message: 'Server error' });
}
});

router.post('/', protect, async (req, res) => {
try {
const auction = new Auction(req.body);
await auction.save();
res.status(201).json(auction);
} catch (error) {
res.status(400).json({ message: 'Invalid data' });
}
});

module.exports = router;