const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

router.get('/scores', protect, async (req, res) => {
try {
const scores = await SustainabilityScore.find();
res.json(scores);
} catch (error) {
res.status(500).json({ message: 'Server error' });
}
});

module.exports = router;