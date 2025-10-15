const express = require('express');
const router = express.Router();
const PendingCarData = require('../models/PendingCarData');

// POST /api/pending-car-data - Submit a custom make or model for review
router.post('/', async (req, res) => {
  try {
    const { type, value, submittedBy } = req.body;
    if (!type || !value || !submittedBy) {
      return res.status(400).json({ message: 'Type, value, and submittedBy are required' });
    }
    const pendingEntry = new PendingCarData({
      type,
      value,
      submittedBy,
    });
    await pendingEntry.save();
    res.status(201).json(pendingEntry);
  } catch (error) {
    console.error('Error submitting custom entry:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;