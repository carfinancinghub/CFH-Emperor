// ----------------------------------------------------------------------
// File: contractRoutes.ts
// Path: backend/routes/contractRoutes.ts
// Author: Gemini, System Architect
// Created: August 11, 2025 at 4:30 PM PDT
// Version: 1.0.0
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------

import { Router } from 'express';
import contractController from '@/controllers/contractController';
import { authMiddleware } from '@/middleware/auth';

const router = Router();

// All contract routes are protected
router.use(authMiddleware);

// Get all contracts for the current user (for the "Document Vault")
router.get('/', contractController.getContractsForUser);

// Generate a new contract from a completed auction
router.post('/auction/:auctionId/generate', contractController.generateContractForAuction);

// Initiate the e-signature process for a contract
router.post('/:contractId/sign', contractController.initiateSigning);


export default router;