// ----------------------------------------------------------------------
// File: ReportingService.test.ts
// Path: backend/src/services/__tests__/ReportingService.test.ts
// Author: Mini, System Architect
// Created: August 11, 2025 at 08:15 AM PDT
// Version: 2.0.0 (Architecturally Superior Version)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// Unit tests for the unified ReportingService.
//
// @architectural_notes
// - **Testing Configuration Logic**: This suite's key test validates our
//   decoupled configuration standard. It checks that the 'generateSecurityAudit'
//   function correctly returns a 'Passed' or 'Failed' status based on the
//   thresholds defined outside the function logic.
//
// ----------------------------------------------------------------------

import ReportingService from '../ReportingService';
import db from '@/services/db';

// --- Mocks ---
jest.mock('@/services/db');
jest.mock('@utils/logger');

describe('ReportingService', () => {

  describe('generateSecurityAudit', () => {
    it('should return a "Passed" status if critical events are below the threshold', async () => {
      // The threshold is 50. We will simulate 10 critical events.
      const mockLogs = Array.from({ length: 10 }, () => ({ eventType: 'login_failed' }));
      (db.getSecurityLogs as jest.Mock).mockResolvedValue(mockLogs);

      const report = await ReportingService.generateSecurityAudit(new Date(), new Date());
      
      expect(report.status).toBe('Passed');
      expect(report.criticalEvents).toBe(10);
    });

    it('should return a "Failed" status if critical events meet or exceed the threshold', async () => {
      // The threshold is 50. We will simulate 55 critical events.
      const mockLogs = Array.from({ length: 55 }, () => ({ eventType: 'login_failed' }));
      (db.getSecurityLogs as jest.Mock).mockResolvedValue(mockLogs);

      const report = await ReportingService.generateSecurityAudit(new Date(), new Date());
      
      expect(report.status).toBe('Failed');
      expect(report.criticalEvents).toBe(55);
    });
  });
});