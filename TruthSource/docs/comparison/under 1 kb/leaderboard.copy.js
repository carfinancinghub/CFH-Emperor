const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
try {
const leaders = await User.find().sort({ points: -1 }).limit(10);
res.json(leaders.map((user, index) => ({
_id: user._id,
username: user.username,
points: user.points,
rank: index + 1,
})));
} catch (error) {
res.status(500).json({ message: 'Server error' });
}
});

module.exports = router;