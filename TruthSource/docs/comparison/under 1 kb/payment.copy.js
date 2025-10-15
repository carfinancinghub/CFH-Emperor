const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

router.post('/', protect, async (req, res) => {
try {
const { amount, cardNumber, expiry, cvv } = req.body;
const payment = new Payment({ amount, user: req.user.id });
await payment.save();
res.status(201).json(payment);
} catch (error) {
res.status(400).json({ message: 'Payment failed' });
}
});

module.exports = router;