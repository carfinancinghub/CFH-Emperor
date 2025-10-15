// ----------------------------------------------------------------------
// File: titleController.ts
// Path: backend/controllers/titleController.ts
// Author: Gemini, System Architect
// Created: August 11, 2025 at 17:14 PDT
// Version: 1.0.0
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------

import { Response } from 'express';
import { AuthenticatedRequest } from '@/middleware/auth';
import TitleService from '@/services/TitleService';

const titleController = {
  async createTitle(req: AuthenticatedRequest, res: Response) {
    try {
      const title = await TitleService.createTitleRecord(req.body);
      res.status(201).json(title);
    } catch (err: any) { res.status(400).json({ message: err.message }); }
  },

  async runVerification(req: AuthenticatedRequest, res: Response) {
    try {
      const { titleId } = req.params;
      const title = await TitleService.runAutomatedVerification(titleId);
      res.status(200).json(title);
    } catch (err: any) { res.status(400).json({ message: err.message }); }
  },

  async getAgentQueue(req: AuthenticatedRequest, res: Response) {
    try {
        // Auth check for 'TITLE_AGENT' role would go here
        const queue = await TitleService.getQueueForAgents();
        res.status(200).json(queue);
    } catch (err: any) { res.status(500).json({ message: err.message }); }
  },

  async assignAgent(req: AuthenticatedRequest, res: Response) {
    try {
        // Auth check for 'TITLE_AGENT' role would go here
        const { titleId } = req.params;
        const title = await TitleService.assignToAgent(titleId, req.body);
        res.status(200).json(title);
    } catch (err: any) { res.status(400).json({ message: err.message }); }
  }
};

export default titleController;