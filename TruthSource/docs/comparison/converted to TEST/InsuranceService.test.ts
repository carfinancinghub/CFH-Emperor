// ----------------------------------------------------------------------
// File: InsuranceService.test.ts
// Path: backend/src/services/__tests__/InsuranceService.test.ts
// Author: Mini, System Architect
// Created: August 11, 2025 at 07:05 AM PDT
// Version: 2.0.0 (Architecturally Superior Version)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------

import InsuranceService from '../InsuranceService';
import Quote from '@/models/Quote';

jest.mock('@/models/Quote', () => jest.fn().mockImplementation(() => ({ save: jest.fn() })));

describe('InsuranceService', () => {
  it('should throw an error if a non-insurer tries to submit a quote', async () => {
    const mockUser = { id: 'user-123', role: 'buyer' };
    const quoteData = { vehicleId: 'v-1', policyType: 'Comprehensive', quoteAmount: 500, duration: 12 };
    await expect(InsuranceService.submitQuote(mockUser as any, quoteData)).rejects.toThrow('Forbidden');
  });

  it('should create a quote for an authorized insurer', async () => {
    const mockUser = { id: 'ins-456', role: 'insurer' };
    const quoteData = { vehicleId: 'v-1', policyType: 'Comprehensive', quoteAmount: 500, duration: 12 };
    await InsuranceService.submitQuote(mockUser as any, quoteData);
    expect(Quote).toHaveBeenCalledWith(expect.objectContaining({
      insurerId: 'ins-456',
      quoteAmount: 500,
    }));
  });
});