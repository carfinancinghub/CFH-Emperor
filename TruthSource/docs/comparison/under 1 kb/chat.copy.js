const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
try {
const messages = await Message.find();
res.json(messages);
} catch (error) {
res.status(500).json({ message: 'Server error' });
}
});

router.post('/', protect, async (req, res) => {
try {
const { content } = req.body;
const message = new Message({ content, sender: req.user.id });
await message.save();
res.status(201).json(message);
} catch (error) {
res.status(400).json({ message: 'Message send failed' });
}
});

module.exports = router;