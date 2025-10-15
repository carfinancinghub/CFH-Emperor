const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

router.post('/place', protect, async (req, res) => {
try {
const { auctionId, amount } = req.body;
const bid = await placeBid(auctionId, amount, req.user);
res.json(bid);
} catch (error) {
res.status(400).json({ message: 'Bid failed' });
}
});

module.exports = router;