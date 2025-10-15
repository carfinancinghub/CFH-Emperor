const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

router.post('/verify', protect, async (req, res) => {
try {
const { transaction } = req.body;
const result = await verifyBlockchain(transaction);
res.json({ verified: result });
} catch (error) {
res.status(500).json({ message: 'Verification failed' });
}
});

module.exports = router;