const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const auth = require('../middleware/auth');
const EscrowTransaction = require('../models/EscrowTransaction');

router.post('/:id/add-note', auth, asyncHandler(async (req, res) => {
  const { note } = req.body;

  const transaction = await EscrowTransaction.findById(req.params.id);
  if (!transaction) throw new Error('Escrow transaction not found');

  if (
    transaction.buyerId.toString() !== req.user.id &&
    transaction.lenderId.toString() !== req.user.id &&
    transaction.sellerId.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    throw new Error('Not authorized to add notes to this transaction');
  }

  transaction.history.push({
    status: 'note',
    note: `${req.user.email} (${req.user.role}): ${note}`,
  });

  await transaction.save();
  res.json({ msg: '✅ Note added', transaction });
}));

module.exports = router;