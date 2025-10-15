// File: myAssignments.js
// Path: server/routes/disputes/myAssignments.js

const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Dispute = require('../../models/Dispute');

// GET /api/disputes/my-assignments
// Returns all disputes where the current user is an assigned judge
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const disputes = await Dispute.find({
      judges: userId
    })
      .populate('initiatorId', 'email')
      .populate('defendantId', 'email')
      .populate('votes.arbitratorId', 'email') // NEW: populate vote authors
      .sort({ createdAt: -1 });

    res.json(disputes);
  } catch (err) {
    console.error('Error fetching judge assignments:', err);
    res.status(500).json({ message: 'Server error while loading assignments' });
  }
});

module.exports = router;
