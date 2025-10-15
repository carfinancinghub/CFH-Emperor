// ----------------------------------------------------------------------
// File: AnalyticsService.test.ts
// Path: backend/src/services/analytics/__tests__/AnalyticsService.test.ts
// Author: Mini, System Architect
// Created: August 11, 2025 at 06:44 AM PDT
// Version: 2.0.0 (Architecturally Superior Version)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------

import AnalyticsService from '../AnalyticsService';
import db from '@/services/db';

jest.mock('@/services/db');

describe('AnalyticsService', () => {
  it('should call the database to log a structured behavior event', async () => {
    (db.getUserById as jest.Mock).mockResolvedValue({ _id: 'user-123' });
    await AnalyticsService.trackAction('user-123', 'PLACE_BID', { amount: 500 });
    expect(db.logBehavior).toHaveBeenCalledWith(expect.objectContaining({
      action: 'PLACE_BID',
      details: { amount: 500 },
    }));
  });
});