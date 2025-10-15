const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

router.get('/quests', protect, async (req, res) => {
try {
const quests = await LoyaltyQuest.find();
res.json(quests);
} catch (error) {
res.status(500).json({ message: 'Server error' });
}
});

module.exports = router;