// File: badgeAudit.js
// Path: backend/routes/badgeAudit.js

const express = require('express');
const router = express.Router();
const BadgeAuditLog = require('../models/BadgeAuditLog');
const { authenticateToken, requireRole } = require('../middleware/auth');

// GET /api/badge-audit - Admin-only route to fetch badge audit logs
router.get('/', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const logs = await BadgeAuditLog.find().sort({ timestamp: -1 }).limit(100);
    res.json(logs);
  } catch (err) {
    console.error('Error fetching badge audit logs:', err);
    res.status(500).json({ error: 'Failed to fetch badge audit logs' });
  }
});

module.exports = router;
