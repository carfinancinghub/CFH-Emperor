const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
try {
const jobs = await MaintenanceJob.find();
res.json(jobs);
} catch (error) {
res.status(500).json({ message: 'Server error' });
}
});

module.exports = router;