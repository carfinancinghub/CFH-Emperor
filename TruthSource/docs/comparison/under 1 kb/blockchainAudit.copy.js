const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const AuditLog = require('../models/AuditLog');

router.get('/', asyncHandler(async (req, res) => {
  const { q } = req.query;
  try {
    const query = q ? {
      $or: [
        { relatedId: { $regex: q, $options: 'i' } },
        { txHash: { $regex: q, $options: 'i' } },
        { walletAddress: { $regex: q, $options: 'i' } },
      ],
    } : {};

    const logs = await AuditLog.find(query).sort({ timestamp: -1 });
    res.json(logs);
  } catch (err) {
    throw new Error('Could not fetch audit logs');
  }
}));

module.exports = router;