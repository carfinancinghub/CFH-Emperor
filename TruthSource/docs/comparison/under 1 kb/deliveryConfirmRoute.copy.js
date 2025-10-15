// File: deliveryConfirmRoute.js
// Path: backend/routes/deliveryConfirmRoute.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Delivery = require('../models/Delivery');

// POST /api/deliveries/:id/confirm - Buyer confirms receipt
router.post('/:id/confirm', auth, async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) return res.status(404).json({ msg: 'Delivery not found' });
    if (delivery.buyerId.toString() !== req.user.id) return res.status(403).json({ msg: 'Not authorized' });

    delivery.status = 'delivered';
    delivery.dropoffTime = new Date();
    await delivery.save();

    res.json({ msg: '✅ Delivery confirmed' });
  } catch (err) {
    console.error('Confirm delivery error:', err);
    res.status(500).json({ msg: 'Server error confirming delivery' });
  }
});

module.exports = router;
