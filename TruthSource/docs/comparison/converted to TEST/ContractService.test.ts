// ----------------------------------------------------------------------
// File: ContractService.test.ts
// Path: backend/src/services/__tests__/ContractService.test.ts
// Author: Mini, System Architect
// Created: August 11, 2025 at 10:45 AM PDT
// Version: 2.0.0 (Architecturally Superior Version)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------

import ContractService from '../ContractService';
import Contract from '@/models/Contract';

jest.mock('@/models/Contract');

describe('ContractService', () => {
  it('should throw a Forbidden error if a user tries to access a contract they are not a party to', async () => {
    const mockContract = { _id: 'contract-123', parties: ['user-abc', 'user-def'] };
    const mockUser = { id: 'user-xyz', role: 'buyer' }; // Not a party to the contract
    (Contract.findById as jest.Mock).mockResolvedValue(mockContract);

    await expect(ContractService.getContract(mockUser as any, 'contract-123'))
      .rejects.toThrow('Forbidden: Not authorized to view this contract.');
  });
});