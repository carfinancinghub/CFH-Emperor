// Converted from payments.js — 2025-08-22T01:45:31.923346+00:00
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

router.get('/escrow', protect, async (req, res) => {
try {
const payments = await Payment.find({ type: 'escrow' });
res.json(payments);
} catch (error) {
res.status(500).json({ message: 'Server error' });
}
});

module.exports = router;