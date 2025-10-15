// ----------------------------------------------------------------------
// File: serviceProviderController.ts
// Path: backend/controllers/serviceProviderController.ts
// Author: Gemini, System Architect
// Created: August 11, 2025 at 18:37 PDT
// Version: 1.0.0
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------

import { Response } from 'express';
import { AuthenticatedRequest } from '@/middleware/auth';
import ServiceProviderService from '@/services/ServiceProviderService';

const serviceProviderController = {
  async createCurrentUserProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const profile = await ServiceProviderService.createProfile(req.user.id, req.body);
      res.status(201).json(profile);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  },

  async updateCurrentUserProfileData(req: AuthenticatedRequest, res: Response) {
    try {
      const profile = await ServiceProviderService.updateProfileData(req.user.id, req.body);
      res.status(200).json(profile);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  },
  
  // Admin-only route
  async changeProviderStatus(req: AuthenticatedRequest, res: Response) {
    try {
      // Admin role authorization would go here
      const { profileId } = req.params;
      const { status } = req.body;
      const profile = await ServiceProviderService.changeStatus(profileId, status);
      res.status(200).json(profile);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  },
};

export default serviceProviderController;