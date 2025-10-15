const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

router.get('/titles', protect, async (req, res) => {
try {
const titles = await Title.find();
res.json(titles);
} catch (error) {
res.status(500).json({ message: 'Server error' });
}
});

module.exports = router;