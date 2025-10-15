// ----------------------------------------------------------------------
// File: EscrowService.ts
// Path: backend/src/services/EscrowService.ts
// Author: Mini, System Architect
// Created: August 11, 2025 at 06:55 AM PDT
// Version: 2.0.0 (Architecturally Superior Version)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// A unified service for managing the escrow lifecycle, including syncing
// transaction data to the blockchain for premium users.
//
// @architectural_notes
// - **Tiered Logic**: The 'syncAction' function contains a clear, secure,
//   backend-driven check to determine whether to perform a standard database
//   sync or a premium blockchain sync.
// - **Dependency Abstraction**: This service is cleanly decoupled from its
//   dependencies ('db', 'blockchain'), making it highly modular and testable.
//
// @todos
// - @free:
//   - [ ] Implement the Mongoose models for 'EscrowTransaction'.
// - @premium:
//   - [ ] ✨ Add a feature to generate a downloadable PDF receipt for a completed escrow transaction.
// - @wow:
//   - [ ] 🚀 Implement a "Smart Escrow" feature that can automatically release funds based on verified, on-chain events from an IoT oracle (e.g., a GPS tracker confirming a vehicle has reached its destination).
//
// ----------------------------------------------------------------------

import logger from '@/utils/logger';
import db from '@/services/db';
import blockchain from '@/services/blockchain';
import { IUser } from '@/types';

const EscrowService = {
  /**
   * Syncs an escrow action, choosing the method based on the user's plan.
   */
  async syncAction(user: IUser, actionData: any) {
    if (user.isPremium) {
      const txHash = await blockchain.recordTransaction(actionData);
      return db.logEscrowAction({ ...actionData, txHash, isBlockchain: true });
    } else {
      return db.logEscrowAction({ ...actionData, isBlockchain: false });
    }
  },

  /**
   * Retrieves the status and, if applicable, the audit trail for a transaction.
   */
  async getTransactionStatus(transactionId: string) {
    const transaction = await db.getEscrowTransaction(transactionId);
    if (!transaction) throw new Error('Transaction not found');
    
    let auditTrail = null;
    if (transaction.isBlockchain && transaction.txHash) {
      auditTrail = await blockchain.getBlockchainAuditTrail(transaction.txHash);
    }
    
    return { status: transaction.status, auditTrail };
  },
};

export default EscrowService;