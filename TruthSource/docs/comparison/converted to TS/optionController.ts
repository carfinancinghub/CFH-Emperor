// ----------------------------------------------------------------------
// File: optionController.ts
// Path: backend/controllers/optionController.ts
// Author: Gemini, System Architect
// Created: August 11, 2025 at 2:45 PM PDT
// Version: 1.0.0
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// The API controller for the competitive "Option-to-Purchase" system.
// It handles HTTP requests and delegates logic to the OptionService.
//
// ----------------------------------------------------------------------

import { Response } from 'express';
import { AuthenticatedRequest } from '@/middleware/auth';
import OptionService from '@/services/OptionService';

const optionController = {
  async createOptionForListing(req: AuthenticatedRequest, res: Response) {
    try {
      const { listingId } = req.params;
      const option = await OptionService.createOptionForListing(req.user.id, listingId);
      res.status(201).json(option);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  },

  async placeBidOnOption(req: AuthenticatedRequest, res: Response) {
    try {
      const { optionId } = req.params;
      const bid = await OptionService.placeBidOnOption(req.user.id, optionId, req.body);
      res.status(201).json(bid);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  },

  async acceptOptionBid(req: AuthenticatedRequest, res: Response) {
    try {
      const { bidId } = req.params;
      const option = await OptionService.acceptOptionBid(req.user.id, bidId);
      res.status(200).json(option);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  },
};

export default optionController;