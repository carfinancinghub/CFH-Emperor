// File: auditRoutes.js
// Path: backend/routes/auditRoutes.js

const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/authMiddleware');
const AuditLog = require('../models/AuditLog');

// @route   GET /api/admin/audit/contract/:id
// @desc    Get audit logs for a contract
// @access  Admin + Lender
router.get('/contract/:id', verifyToken, requireRole(['admin', 'lender']), async (req, res) => {
  try {
    const logs = await AuditLog.find({ contractId: req.params.id }).sort({ timestamp: -1 });
    res.json(logs);
  } catch (err) {
    console.error('Audit fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

module.exports = router;
