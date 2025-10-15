const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const auth = require('../middleware/auth');
const { generateMatchesForBuyer } = require('../utils/aiMatchmaker');

router.post('/generate', auth, asyncHandler(async (req, res) => {
  const { buyerId, preferences } = req.body;

  const matches = await generateMatchesForBuyer(buyerId, preferences);
  res.json(matches);
}));

module.exports = router;