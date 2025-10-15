// Converted from arbitratorController.js — 2025-08-22T11:57:35.116150+00:00
// File: arbitratorController.js
// Path: backend/controllers/users/arbitratorController.js

const User = require('@/models/User');


// GET /api/users/arbitrators
exports.getArbitrators = async (req, res) => {
  try {
    const arbitrators = await User.find({
      'arbitrationStats.resolvedCases': { $gt: 0 }
    }).select('username email arbitrationStats');

    res.status(200).json(arbitrators);
  } catch (error) {
    console.error('Failed to fetch arbitrators:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
