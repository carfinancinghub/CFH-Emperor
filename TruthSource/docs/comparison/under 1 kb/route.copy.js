const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

router.get('/transportation', protect, async (req, res) => {
try {
const routes = await Route.find();
res.json(routes);
} catch (error) {
res.status(500).json({ message: 'Server error' });
}
});

module.exports = router;