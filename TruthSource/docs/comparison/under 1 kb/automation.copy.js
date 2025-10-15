const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

router.get('/tasks', protect, async (req, res) => {
try {
const tasks = await AutomationTask.find();
res.json(tasks);
} catch (error) {
res.status(500).json({ message: 'Server error' });
}
});

module.exports = router;