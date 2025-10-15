const express = require('express');
const router = express.Router();
const generateContractPDF = require('../contracts/pdfGenerator');
const getSignatureAnchorTags = require('../contracts/signatureInit');
const path = require('path');

router.post('/generate', (req, res) => {
  const contractData = req.body;
  const filePath = path.join(__dirname, '../../pdfs/contract.pdf');
  generateContractPDF(contractData, filePath);
  res.json({ message: 'PDF generated', file: '/pdfs/contract.pdf' });
});

router.get('/esignature/initiate', (req, res) => {
  const anchors = getSignatureAnchorTags();
  res.json({ anchors });
});

module.exports = router;
