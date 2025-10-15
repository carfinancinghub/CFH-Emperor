// File: SecurityLogger.test.ts
// Path: backend/services/security/__tests__/SecurityLogger.test.ts
// Purpose: Unit tests for the structured, type-safe SecurityLogger service.

import SecurityLogger from '../SecurityLogger';
import db from '@/services/db';
import logger from '@/utils/logger';

// --- Mocks ---
jest.mock('@/services/db');
jest.mock('@utils/logger');

describe('SecurityLogger Service', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('logSecurityEvent', () => {
    it('should call the database with a correctly structured event object', async () => {
      const eventType = 'LOGIN_FAILED';
      const severity = 'WARN';
      const details = { attemptedUserId: 'user-abc', ipAddress: '192.168.1.100' };

      // Act
      const result = await SecurityLogger.logSecurityEvent(eventType, severity, details);

      // Assert
      expect(result.status).toBe('logged');
      expect(db.logSecurityEvent).toHaveBeenCalledTimes(1);
      
      const loggedEvent = (db.logSecurityEvent as jest.Mock).mock.calls[0][0];
      expect(loggedEvent.eventType).toBe(eventType);
      expect(loggedEvent.severity).toBe(severity);
      expect(loggedEvent.details).toEqual(details);
      expect(loggedEvent.timestamp).toBeInstanceOf(Date);
    });

    it('should throw an error if the database call fails', async () => {
      (db.logSecurityEvent as jest.Mock).mockRejectedValue(new Error('DB connection error'));

      await expect(SecurityLogger.logSecurityEvent('ACCOUNT_LOCKED', 'CRITICAL', { userId: 'user-123', reason: 'suspicion' }))
        .rejects.toThrow('DB connection error');
        
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('getSecurityLogs', () => {
    it('should return logs from the database for a given date range', async () => {
      const mockLogs = [{ eventType: 'LOGIN_SUCCESS' }];
      (db.getSecurityLogs as jest.Mock).mockResolvedValue(mockLogs);
      
      const startDate = new Date('2025-08-01');
      const endDate = new Date('2025-08-02');

      const result = await SecurityLogger.getSecurityLogs(startDate, endDate);

      expect(result).toEqual(mockLogs);
      expect(db.getSecurityLogs).toHaveBeenCalledWith(startDate, endDate);
    });
  });
});