// File: payout.js
// Path: backend/routes/stripe/payout.js

const express = require('express');
const router = express.Router();
const protect = require('../../middleware/protect');
const {
  initiatePayout,
  createPaymentIntent,
} = require('../../controllers/StripeController');

// @route   POST /api/stripe/payout
// @desc    Send payout to a connected account
// @access  Private
router.post('/payout', protect, initiatePayout);

// @route   POST /api/stripe/payment-intent
// @desc    Create a payment intent for collecting from buyer
// @access  Private
router.post('/payment-intent', protect, createPaymentIntent);

module.exports = router;
