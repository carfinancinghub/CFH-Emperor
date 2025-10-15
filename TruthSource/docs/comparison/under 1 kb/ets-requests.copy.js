// File: ets-requests.js
// Path: backend/routes/ets-requests.js

const express = require('express');
const router = express.Router();
const EtsRequestLog = require('../../server/models/EtsRequestLog');
const { authenticateUser } = require('../middleware/authMiddleware');

// GET recent ETS requests (admin only)
router.get('/', authenticateUser, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
    const logs = await EtsRequestLog.find().sort({ createdAt: -1 }).limit(100);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch ETS request logs.' });
  }
});

// POST new ETS request log (internal use)
router.post('/', async (req, res) => {
  try {
    const log = new EtsRequestLog(req.body);
    await log.save();
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ error: 'Failed to record ETS request log.' });
  }
});

module.exports = router;
