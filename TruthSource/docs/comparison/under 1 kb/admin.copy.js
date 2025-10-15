const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

router.get('/notifications', protect, async (req, res) => {
try {
const notifications = await Notification.find();
res.json(notifications);
} catch (error) {
res.status(500).json({ message: 'Server error' });
}
});

router.post('/notifications/broadcast', protect, async (req, res) => {
try {
const { content } = req.body;
const notification = new Notification({ content, type: 'admin_broadcast' });
await notification.save();
res.status(201).json(notification);
} catch (error) {
res.status(400).json({ message: 'Broadcast failed' });
}
});

module.exports = router;