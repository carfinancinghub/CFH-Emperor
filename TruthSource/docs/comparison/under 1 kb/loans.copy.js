const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

router.get('/compare', protect, async (req, res) => {
try {
const loans = await Loan.find();
res.json(loans);
} catch (error) {
res.status(500).json({ message: 'Server error' });
}
});

module.exports = router;