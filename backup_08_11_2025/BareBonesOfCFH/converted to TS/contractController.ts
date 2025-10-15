// ----------------------------------------------------------------------
// File: contractController.ts
// Path: backend/controllers/contractController.ts
// Author: Gemini, System Architect
// Created: August 11, 2025 at 4:30 PM PDT
// Version: 1.0.0
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// The API controller for the Contracts & Documents System. It handles all
// HTTP requests for generating, retrieving, and managing contracts.
//
// ----------------------------------------------------------------------

import { Response } from 'express';
import { AuthenticatedRequest } from '@/middleware/auth';
import ContractService from '@/services/ContractService';
import Contract from '@/models/Contract'; // For read operations

const contractController = {
  /**
   * Generates a new contract for a completed auction.
   */
  async generateContractForAuction(req: AuthenticatedRequest, res: Response) {
    try {
      const { auctionId } = req.params;
      const { templateName, documentType, parties, data } = req.body;

      const contract = await ContractService.generateAndStoreContract(
        templateName,
        data,
        auctionId,
        parties,
        documentType
      );
      res.status(201).json(contract);
    } catch (err: any) {
      res.status(500).json({ message: 'Failed to generate contract.', error: err.message });
    }
  },

  /**
   * (Premium) Initiates the e-signature process for a contract.
   */
  async initiateSigning(req: AuthenticatedRequest, res: Response) {
    try {
        const { contractId } = req.params;
        const contract = await Contract.findById(contractId);
        if (!contract) {
            return res.status(404).json({ message: 'Contract not found.' });
        }
        // Authorization check would go here
        const result = await ContractService.initiateSigningProcess(contract);
        res.status(200).json(result);
    } catch (err: any) {
        res.status(500).json({ message: 'Failed to initiate signing process.', error: err.message });
    }
  },

  /**
   * Retrieves all contracts associated with the logged-in user.
   */
  async getContractsForUser(req: AuthenticatedRequest, res: Response) {
    try {
      const contracts = await Contract.find({ 'parties.user': req.user.id });
      res.status(200).json(contracts);
    } catch (err: any) {
      res.status(500).json({ message: 'Failed to retrieve contracts.', error: err.message });
    }
  },
};

export default contractController;