// File: escrowHoldRules.js
// Path: backend/utils/escrowHoldRules.js

const Title = require('../models/Title');

/**
 * Determines if escrow payout should be held for a given auction.
 * Blocks payout if the title status is not verified unless the buyer is flagged as institutional.
 */
async function shouldHoldEscrowPayout({ carId, buyerId, buyerIsInstitutional = false }) {
  try {
    const titleRecord = await Title.findOne({ carId, buyerId });

    if (!titleRecord || titleRecord.status !== 'verified') {
      return !buyerIsInstitutional; // ✅ Hold if not verified AND buyer is not institutional
    }

    return false; // ✅ Do not hold if title is verified
  } catch (err) {
    console.error('❌ Escrow Hold Check Failed:', err);
    return true; // Fail-safe: hold if there's an error
  }
}

module.exports = { shouldHoldEscrowPayout };
