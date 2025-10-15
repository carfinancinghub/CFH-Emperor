// ----------------------------------------------------------------------
// File: EscrowService.test.ts
// Path: backend/src/services/__tests__/EscrowService.test.ts
// Author: Mini, System Architect
// Created: August 11, 2025 at 06:55 AM PDT
// Version: 2.0.0 (Architecturally Superior Version)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------

import EscrowService from '../EscrowService';
import db from '@/services/db';
import blockchain from '@/services/blockchain';

jest.mock('@/services/db');
jest.mock('@/services/blockchain');

describe('EscrowService', () => {
  it('should call the blockchain service for a premium user', async () => {
    const mockUser = { isPremium: true };
    await EscrowService.syncAction(mockUser as any, { amount: 100 });
    expect(blockchain.recordTransaction).toHaveBeenCalledWith({ amount: 100 });
    expect(db.logEscrowAction).toHaveBeenCalledWith(expect.objectContaining({ isBlockchain: true }));
  });
  
  it('should NOT call the blockchain service for a non-premium user', async () => {
    const mockUser = { isPremium: false };
    await EscrowService.syncAction(mockUser as any, { amount: 100 });
    expect(blockchain.recordTransaction).not.toHaveBeenCalled();
    expect(db.logEscrowAction).toHaveBeenCalledWith(expect.objectContaining({ isBlockchain: false }));
  });
});