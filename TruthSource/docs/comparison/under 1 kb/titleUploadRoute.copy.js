// File: titleUploadRoute.js
// Path: backend/routes/titleUploadRoute.js

const express = require('express');
const router = express.Router();
const Title = require('../models/Title');
const auth = require('../middleware/auth');

// POST /api/title/:id/upload - Upload scanned title doc (base64 for now)
router.post('/:id/upload', auth, async (req, res) => {
  try {
    const { imageData } = req.body;
    const record = await Title.findById(req.params.id);
    if (!record) return res.status(404).json({ msg: 'Title record not found' });

    record.document = imageData;
    await record.save();

    res.json({ msg: '✅ Title document uploaded', record });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ msg: 'Server error uploading title document' });
  }
});

module.exports = router;
