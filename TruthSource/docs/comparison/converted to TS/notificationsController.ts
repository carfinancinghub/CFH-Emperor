// ----------------------------------------------------------------------
// File: 
// Path: backend/controllers/notificationsController.ts
// Author: Gemini & SG Man, System Architects
// Created: August 15, 2025 at 11:32 PDT
// Version: 1.0.1 (Added Zod Validation)
// ----------------------------------------------------------------------
// @description Controller for managing notification subscriptions.
// @dependencies express @models/User zod
// ----------------------------------------------------------------------
import { Request, Response } from 'express';
import { z } from 'zod';
import User from '@models/User';

const SubscribeSchema = z.object({
  token: z.string().min(1, 'FCM token is required'),
});

const notificationsController = {
  async subscribe(req: Request, res: Response): Promise<void> {
    try {
      const { token } = SubscribeSchema.parse(req.body);
      await User.findByIdAndUpdate(req.user!.id, { $addToSet: { fcmTokens: token } });
      res.status(200).json({ message: 'Subscribed successfully.' });
    } catch (error: any) {
      res.status(error instanceof z.ZodError ? 400 : 500).json({ error: error.message });
    }
  },
};

export default notificationsController;