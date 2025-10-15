// File: badgeStatsRoute.js
// Path: backend/routes/badgeStatsRoute.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /api/users/badge-stats - Count how many users have each badge
router.get('/badge-stats', async (req, res) => {
  try {
    const users = await User.find({ badges: { $exists: true, $not: { $size: 0 } } });
    const counts = {};

    users.forEach(user => {
      user.badges.forEach(badge => {
        if (!counts[badge.key]) counts[badge.key] = 0;
        counts[badge.key] += 1;
      });
    });

    res.json(counts);
  } catch (err) {
    console.error('Badge stats error:', err);
    res.status(500).json({ msg: 'Error generating badge stats' });
  }
});

module.exports = router;
