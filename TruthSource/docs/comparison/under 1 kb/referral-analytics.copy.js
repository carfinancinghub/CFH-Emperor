const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
try {
const referrals = await Referral.find();
res.json(referrals);
} catch (error) {
res.status(500).json({ message: 'Server error' });
}
});

module.exports = router;