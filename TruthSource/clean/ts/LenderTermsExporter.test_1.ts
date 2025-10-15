/**
 * File: LenderTermsExporter.test.ts
 * Path: backend/tests/controllers/lender/LenderTermsExporter.test.ts
 * Purpose: Unit tests for LenderTermsExporter.ts using Jest and Supertest
 * Tier: Free (core test), Premium/Wow++ (advanced insights test coverage)
 * Crown Certified: In Progress
 */

import request from 'supertest';
import app from '@/server';
import redisClient from '@utils/redisClient';
import LenderTermsExporter from '@controllers/lender/LenderTermsExporter';
import Lender from '@models/lender/Lender';
import PremiumChecker from '@utils/PremiumChecker';

jest.mock('@models/lender/Lender');
jest.mock('@utils/PremiumChecker');
jest.mock('@utils/redisClient', () => ({
  get: jest.fn(),
  setEx: jest.fn(),
}));

const mockLender = {
  _id: '123',
  name: 'Test Bank',
  loanOffers: [
    { id: 'offer1', rate: 3.5, term: '36 months', amount: 10000 },
  ],
};

const mockUserFree = {
  id: 'userFree',
  profile: { subscriptionTier: 'free', preferences: { riskTolerance: 'low' } },
};

const mockUserPremium = {
  id: 'userPremium',
  profile: { subscriptionTier: 'premium', preferences: { riskTolerance: 'medium' } },
};

describe('LenderTermsExporter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('validateExportFormat', () => {
    it('should return true for supported formats', () => {
      expect(LenderTermsExporter.validateExportFormat('csv')).toBe(true);
      expect(LenderTermsExporter.validateExportFormat('pdf')).toBe(true);
    });

    it('should return false for unsupported formats', () => {
      expect(LenderTermsExporter.validateExportFormat('xml')).toBe(false);
    });
  });

  describe('exportLenderTerms', () => {
    it('should return 400 for invalid format', async () => {
      const req: any = { user: mockUserFree, params: { id: '123' }, query: { format: 'invalid' } };
      const res: any = mockRes();
      await LenderTermsExporter.exportLenderTerms(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 404 if lender not found', async () => {
      (Lender.findById as jest.Mock).mockResolvedValue(null);
      const req: any = { user: mockUserFree, params: { id: '999' }, query: {} };
      const res: any = mockRes();
      await LenderTermsExporter.exportLenderTerms(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should return basic export for free user', async () => {
      (Lender.findById as jest.Mock).mockResolvedValue(mockLender);
      const req: any = { user: mockUserFree, params: { id: '123' }, query: {} };
      const res: any = mockRes();
      await LenderTermsExporter.exportLenderTerms(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ premium: false }));
    });

    it('should return premium export with insights', async () => {
      (Lender.findById as jest.Mock).mockResolvedValue(mockLender);
      (PremiumChecker.isFeatureUnlocked as jest.Mock).mockResolvedValue(true);
      const req: any = { user: mockUserPremium, params: { id: '123' }, query: {} };
      const res: any = mockRes();
      await LenderTermsExporter.exportLenderTerms(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ premium: true }));
    });
  });
});

function mockRes() {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}
