const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

router.post('/', protect, async (req, res) => {
try {
const document = new Document({ file: req.files.document, user: req.user.id });
await document.save();
res.status(201).json(document);
} catch (error) {
res.status(400).json({ message: 'Upload failed' });
}
});

module.exports = router;