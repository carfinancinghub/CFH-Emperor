// File: SecurityAudit.test.ts
// Path: backend/services/security/__tests__/SecurityAudit.test.ts
// Purpose: Tests for the proactive SecurityAudit intelligence service.

import SecurityAudit from '../SecurityAudit';
import db from '@/services/db';
import logger from '@/utils/logger';

// --- Mocks ---
jest.mock('@/services/db');
jest.mock('@utils/logger');

describe('SecurityAudit Service', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('auditSecurityLogs', () => {
    const startDate = new Date('2025-08-10');
    const endDate = new Date('2025-08-11');

    it('should return a "Passed" status and not trigger an alert if thresholds are not breached', async () => {
      const mockLogs = [
        { eventType: 'LOGIN_SUCCESS', severity: 'INFO' },
        { eventType: 'LOGIN_FAILED', severity: 'WARN' },
        { eventType: 'ACCOUNT_LOCKED', severity: 'CRITICAL' }, // Only 1 critical event
      ];
      (db.getSecurityLogs as jest.Mock).mockResolvedValue(mockLogs);

      const result = await SecurityAudit.auditSecurityLogs(startDate, endDate);

      expect(result.status).toBe('Passed');
      expect(result.criticalEvents).toBe(1);
      expect(logger.error).not.toHaveBeenCalledWith(expect.stringContaining('ALERT'));
    });

    it('should return a "Failed" status and trigger an alert if thresholds are breached', async () => {
      // Generate 51 critical events to exceed the threshold of 50
      const mockLogs = Array.from({ length: 51 }, () => ({ eventType: 'ACCOUNT_LOCKED', severity: 'CRITICAL' }));
      (db.getSecurityLogs as jest.Mock).mockResolvedValue(mockLogs);

      const result = await SecurityAudit.auditSecurityLogs(startDate, endDate);

      expect(result.status).toBe('Failed');
      expect(result.criticalEvents).toBe(51);
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('ALERT: Security Audit FAILED: Security Logs'));
    });

    it('should include historical comparison data when the "compare" option is true', async () => {
      // Current period has 20 critical events
      const currentLogs = Array.from({ length: 20 }, () => ({ severity: 'CRITICAL' }));
      // Previous period had 10 critical events
      const previousLogs = Array.from({ length: 10 }, () => ({ severity: 'CRITICAL' }));

      // Mock DB to return current logs first, then previous logs
      (db.getSecurityLogs as jest.Mock)
        .mockResolvedValueOnce(currentLogs)
        .mockResolvedValueOnce(previousLogs);

      const result = await SecurityAudit.auditSecurityLogs(startDate, endDate, { compare: true });

      expect(db.getSecurityLogs).toHaveBeenCalledTimes(2);
      expect(result.criticalEvents).toBe(20);
      expect(result.previousPeriod?.criticalEvents).toBe(10);
      expect(result.changePercentage).toBe(100); // (20 - 10) / 10 * 100 = 100% increase
    });
  });
});