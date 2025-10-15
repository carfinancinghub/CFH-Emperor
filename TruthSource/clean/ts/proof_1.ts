// Converted from proof.js — 2025-08-22T11:57:34.559197+00:00
// File: proof.js
// Path: backend/routes/hauler/proof.js
// 👑 Cod1 Crown Certified — Hauler Proof of Delivery API Router

const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/auth');
const proofController = require('../../controllers/hauler/proofOfDeliveryController');

// Submit proof of delivery (notes, photos, GPS)
router.post('/:jobId', protect, proofController.submitProofOfDelivery);

// Get proof of delivery for a job
router.get('/:jobId', protect, proofController.getProofOfDelivery);

module.exports = router;
