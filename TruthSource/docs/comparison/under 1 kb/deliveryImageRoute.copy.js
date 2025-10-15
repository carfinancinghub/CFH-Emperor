// File: deliveryImageRoute.js
// Path: backend/routes/deliveryImageRoute.js

const express = require('express');
const router = express.Router();
const Delivery = require('../models/Delivery');
const auth = require('../middleware/auth');

// POST /api/deliveries/:id/image - Upload proof of delivery image
router.post('/:id/image', auth, async (req, res) => {
  try {
    const { imageData } = req.body;
    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) return res.status(404).json({ msg: 'Delivery not found' });

    delivery.proofImage = imageData;
    await delivery.save();

    res.json({ msg: '✅ Image saved to delivery', image: imageData });
  } catch (err) {
    console.error('Image upload error:', err);
    res.status(500).json({ msg: 'Server error saving image' });
  }
});

module.exports = router;
