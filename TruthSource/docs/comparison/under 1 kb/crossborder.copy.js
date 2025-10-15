const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

router.get('/options', protect, async (req, res) => {
try {
const options = await CrossBorderOption.find();
res.json(options);
} catch (error) {
res.status(500).json({ message: 'Server error' });
}
});

module.exports = router;