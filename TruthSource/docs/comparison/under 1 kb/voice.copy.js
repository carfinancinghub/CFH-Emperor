const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

router.post('/command', protect, async (req, res) => {
try {
const { command } = req.body;
const result = await processVoiceCommand(command);
res.json(result);
} catch (error) {
res.status(500).json({ message: 'Command failed' });
}
});

module.exports = router;