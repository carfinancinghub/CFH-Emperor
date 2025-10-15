// Converted from exportMapRoute.js — 2025-08-22T11:57:34.334547+00:00
// File: exportMapRoute.js
// Path: backend/routes/hauler/exportMapRoute.js
// 👑 Cod1 Certified — Hauler Route for Map Snapshot PDF Export

const express = require('express');
const router = express.Router();
const embedMapSnapshotPDF = require('../../controllers/hauler/embedMapSnapshotPDF');
const authenticate = require('../../middleware/authenticate');

// @route   GET /api/hauler/jobs/:jobId/export-pdf-map
// @desc    Generate delivery PDF with map snapshot image
// @access  Protected (Hauler, Admin, Judge)
router.get('/jobs/:jobId/export-pdf-map', authenticate, embedMapSnapshotPDF);

module.exports = router;
