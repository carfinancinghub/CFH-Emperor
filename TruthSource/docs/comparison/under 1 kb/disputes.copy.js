const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
try {
const disputes = await Dispute.find();
res.json(disputes);
} catch (error) {
res.status(500).json({ message: 'Server error' });
}
});

router.patch('/:id/resolve', protect, async (req, res) => {
try {
const { resolution } = req.body;
const dispute = await Dispute.findById(req.params.id);
dispute.status = 'resolved';
dispute.resolution = resolution;
await dispute.save();
res.json(dispute);
} catch (error) {
res.status(400).json({ message: 'Resolution failed' });
}
});

module.exports = router;