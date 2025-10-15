// Converted from haulerProofRoutes.js — 2025-08-22T11:57:34.463528+00:00
// File: haulerProofRoutes.js
// Path: backend/routes/hauler/haulerProofRoutes.js
// 👑 Cod1 Crown Certified — Hauler Proof Upload Route

const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../../middleware/auth');
const uploadHaulerProof = require('../../controllers/hauler/uploadHaulerProofController');

// Multer config for temporary memory storage (we stream to S3 or similar)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /api/hauler/jobs/:jobId/proof
router.post('/jobs/:jobId/proof', protect, upload.single('photo'), uploadHaulerProof);

module.exports = router;
