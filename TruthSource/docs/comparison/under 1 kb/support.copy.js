const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

router.post('/query', protect, async (req, res) => {
try {
const { query } = req.body;
const ticket = await createSupportTicket(query, req.user);
res.json(ticket);
} catch (error) {
res.status(400).json({ message: 'Query failed' });
}
});

module.exports = router;