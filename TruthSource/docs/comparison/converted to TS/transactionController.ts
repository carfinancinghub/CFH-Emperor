// ----------------------------------------------------------------------
// File: transactionController.ts
// Path: backend/controllers/transactionController.ts
// Author: Gemini & SG Man, System Architects
// Created: August 12, 2025 at 15:25 PDT
// Version: 1.0.2 (Enhanced with List Transactions)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// API controller for transaction finalization and listing endpoints.
//
// @architectural_notes
// - **Secure**: Requires admin authentication for sensitive operations.
// - **Structured Responses**: Returns transaction data with success messages.
// - **Validated**: Uses Zod for parameter validation.
//
// @todos
// - @free:
//   - [x] Add endpoint for auction finalization.
//   - [x] Add endpoint for listing transactions.
// - @premium:
//   - [ ] ✨ Add endpoint for transaction report generation.
//
// ----------------------------------------------------------------------
import { Request, Response } from 'express';
import TransactionService from '@/services/TransactionService';
import { z } from 'zod';

const ParamSchema = z.object({
  auctionId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid auction ID'),
});

const QuerySchema = z.object({
  page: z.string().optional().transform(val => (val ? parseInt(val, 10) : 1)),
  limit: z.string().optional().transform(val => (val ? parseInt(val, 10) : 20)),
});

const transactionController = {
  /**
   * Triggers the finalization and settlement process for a completed auction.
   * @returns { data: ITransaction }
   */
  async finalizeAuction(req: Request & { user: { id: string } }, res: Response) {
    try {
      const { auctionId } = ParamSchema.parse(req.params);
      const transaction = await TransactionService.finalizeAuction(auctionId, req.user.id);
      res.status(201).json({ message: 'Transaction finalized successfully.', data: transaction });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: 'Invalid auction ID', errors: err.errors });
      } else {
        res.status(err.status || 500).json({ message: err.message || 'Transaction finalization failed.' });
      }
    }
  },

  /**
   * Retrieves a paginated list of transactions.
   * @returns { data: ITransaction[], meta: { page, limit, total } }
   */
  async getTransactions(req: Request & { user: { id: string } }, res: Response) {
    try {
      const { page, limit } = QuerySchema.parse(req.query);
      const transactions = await TransactionService.getTransactions({ page, limit }, req.user.id);
      res.status(200).json({
        data: transactions.transactions,
        meta: { page, limit, total: transactions.total },
      });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: 'Invalid query parameters', errors: err.errors });
      } else {
        res.status(err.status || 500).json({ message: err.message || 'Failed to retrieve transactions.' });
      }
    }
  },
};

export default transactionController;