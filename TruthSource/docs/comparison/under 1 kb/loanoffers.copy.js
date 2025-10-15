const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
try {
const offers = await LoanOffer.find();
res.json(offers);
} catch (error) {
res.status(500).json({ message: 'Server error' });
}
});

module.exports = router;