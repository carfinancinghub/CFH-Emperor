// File: errorlog.js
// Path: backend/routes/errorlog.js

const express = require('express');
const router = express.Router();
const ErrorLog = require('../../server/models/ErrorLog');
const { authenticateUser } = require('../middleware/authMiddleware');

// GET recent error logs (admin only)
router.get('/', authenticateUser, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });

    const logs = await ErrorLog.find().sort({ createdAt: -1 }).limit(100);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch error logs.' });
  }
});

// POST new error log (internal use)
router.post('/', async (req, res) => {
  try {
    const log = new ErrorLog(req.body);
    await log.save();
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ error: 'Failed to record error log.' });
  }
});

module.exports = router;
