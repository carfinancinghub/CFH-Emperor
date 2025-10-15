const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

router.get('/dynamic', protect, async (req, res) => {
try {
const prices = await DynamicPrice.find();
res.json(prices);
} catch (error) {
res.status(500).json({ message: 'Server error' });
}
});

module.exports = router;