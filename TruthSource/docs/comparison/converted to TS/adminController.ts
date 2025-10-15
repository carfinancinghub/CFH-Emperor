// ----------------------------------------------------------------------
// File: adminController.ts
// Path: backend/controllers/adminController.ts
// Author: Gemini, System Architect
// Created: August 11, 2025 at 18:51 PDT
// Version: 1.0.0
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// The API controller for the Admin User Management System. It securely
// handles requests and delegates all logic to the AdminService.
//
// ----------------------------------------------------------------------

import { Response } from 'express';
import { AuthenticatedRequest } from '@/middleware/auth';
import AdminService from '@/services/AdminService';

const adminController = {
  async getAllUsers(req: AuthenticatedRequest, res: Response) {
    try {
      const users = await AdminService.getAllUsers(req.query);
      res.status(200).json(users);
    } catch (err: any) { res.status(500).json({ message: 'Failed to get users.' }); }
  },

  async getUserDetails(req: AuthenticatedRequest, res: Response) {
    try {
      const { userId } = req.params;
      const user = await AdminService.getUserDetails(userId);
      res.status(200).json(user);
    } catch (err: any) { res.status(404).json({ message: 'User not found.' }); }
  },

  async updateUserStatus(req: AuthenticatedRequest, res: Response) {
    try {
      const { targetUserId } = req.params;
      const user = await AdminService.updateUserStatus(req.user.id, targetUserId, req.body);
      res.status(200).json(user);
    } catch (err: any) { res.status(400).json({ message: err.message }); }
  },

  async verifyServiceProvider(req: AuthenticatedRequest, res: Response) {
    try {
      const { profileId } = req.params;
      const profile = await AdminService.verifyServiceProvider(req.user.id, profileId);
      res.status(200).json(profile);
    } catch (err: any) { res.status(400).json({ message: err.message }); }
  },

  async impersonateUser(req: AuthenticatedRequest, res: Response) {
    try {
      const { targetUserId } = req.body;
      const result = await AdminService.impersonateUser(req.user.id, targetUserId);
      res.status(200).json(result);
    } catch (err: any) { res.status(400).json({ message: err.message }); }
  },
};

export default adminController;