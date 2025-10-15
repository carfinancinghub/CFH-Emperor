const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

router.get('/reviews', protect, async (req, res) => {
try {
const reviews = await ComplianceReview.find();
res.json(reviews);
} catch (error) {
res.status(500).json({ message: 'Server error' });
}
});

module.exports = router;