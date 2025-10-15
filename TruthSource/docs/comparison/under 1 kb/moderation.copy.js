const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

router.get('/posts', protect, async (req, res) => {
try {
const posts = await Post.find();
res.json(posts);
} catch (error) {
res.status(500).json({ message: 'Server error' });
}
});

module.exports = router;