// ----------------------------------------------------------------------
// File: PaymentProcessor.ts
// Path: backend/services/PaymentProcessor.ts
// Author: Gemini & SG Man, System Architects
// Created: August 13, 2025 at 17:15 PDT
// Version: 1.0.2 (Enhanced with Validation & Error Handling)
// Artifact version ID: 63257312-4cf8-4cf9-bd1a-112746ff2666
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// Service for processing financial payouts using Stripe Connect.
//
// @architectural_notes
// - **Secure & Compliant**: Integrates with Stripe Connect for KYC/AML compliance.
// - **Auditable**: Logs payout actions to HistoryService.
// - **Validated**: Uses Zod for input validation.
//
// @todos
// - @premium:
//   - [ ] ✨ Implement payout schedules (e.g., instant vs. standard).
// - @wow:
//   - [ ] 🚀 Integrate AI-powered fraud detection for payouts.
//
// ----------------------------------------------------------------------
import Stripe from 'stripe';
import { z } from 'zod';
import HistoryService from '@/services/HistoryService';
import UserService from '@/services/UserService';
import { ITransaction } from '@/models/Transaction';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

class PaymentError extends Error {
  status: number;
  constructor(message: string, status: number = 400) {
    super(message);
    this.status = status;
  }
}

const PayoutSchema = z.object({
  payee: z.string().refine((val) => val.match(/^[0-9a-fA-F]{24}$/), 'Invalid payee ID'),
  amount: z.number().min(0, 'Amount must be non-negative'),
  status: z.enum(['PENDING', 'COMPLETED', 'FAILED']),
});

const TransactionSchema = z.object({
  _id: z.string().refine((val) => val.match(/^[0-9a-fA-F]{24}$/), 'Invalid transaction ID'),
  payouts: z.array(PayoutSchema),
});

const PaymentProcessor = {
  async executePayouts(transaction: ITransaction, adminUserId: string): Promise<void> {
    const validatedTransaction = TransactionSchema.parse(transaction);
    if (!adminUserId.match(/^[0-9a-fA-F]{24}$/)) {
      throw new PaymentError('Invalid admin user ID', 400);
    }

    await HistoryService.logAction(adminUserId, 'EXECUTE_PAYOUTS_START', { transactionId: validatedTransaction._id });

    for (const payout of validatedTransaction.payouts) {
      try {
        const user = await UserService.getUserById(payout.payee);
        const stripeAccountId = user.stripeAccountId || 'acct_placeholder'; // Retrieve from user profile

        const transfer = await stripe.transfers.create({
          amount: Math.round(payout.amount * 100), // Convert to cents
          currency: 'usd',
          destination: stripeAccountId,
          transfer_group: `TRANSACTION_${validatedTransaction._id}`,
        });

        payout.status = 'COMPLETED';
        payout.payoutId = transfer.id;

        await HistoryService.logAction(adminUserId, 'PAYOUT_SUCCESS', {
          transactionId: validatedTransaction._id,
          payeeId: payout.payee,
          amount: payout.amount,
          stripeTransferId: transfer.id,
        });
      } catch (error: any) {
        payout.status = 'FAILED';
        await HistoryService.logAction(adminUserId, 'PAYOUT_FAILED', {
          transactionId: validatedTransaction._id,
          payeeId: payout.payee,
          error: error.message,
        });
        throw new PaymentError(`Payout failed for payee ${payout.payee}: ${error.message}`, 500);
      }
    }

    await transaction.save();
    await HistoryService.logAction(adminUserId, 'EXECUTE_PAYOUTS_COMPLETE', { transactionId: validatedTransaction._id });
  },
};

export default PaymentProcessor;