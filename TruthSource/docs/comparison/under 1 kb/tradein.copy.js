const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

router.post('/evaluate', protect, async (req, res) => {
try {
const { make, model, year, condition } = req.body;
const value = Math.random() * 10000; // Placeholder valuation
res.json({ value });
} catch (error) {
res.status(500).json({ message: 'Evaluation failed' });
}
});

module.exports = router;