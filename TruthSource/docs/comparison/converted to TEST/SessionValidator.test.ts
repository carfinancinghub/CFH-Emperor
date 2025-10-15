// File: SessionValidator.test.ts
// Path: backend/services/security/__tests__/SessionValidator.test.ts
// Purpose: Unit tests for the multi-layered SessionValidator security service.
// Author: Mini, System Architect
// Date: August 10, 2025
// 👑 Cod1 Crown Certified — A comprehensive test suite for our core security engine.

import SessionValidator from '../SessionValidator';
import db from '@/services/db';
import logger from '@/utils/logger';

// --- Mocks ---
jest.mock('@/services/db');
jest.mock('@utils/logger');

describe('SessionValidator Service', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('validateSession', () => {
    const mockSession = {
      token: 'valid-token',
      expiresAt: new Date(Date.now() + 3600 * 1000), // Expires in 1 hour
      ipAddress: '192.168.1.1',
      userAgent: 'Chrome',
    };

    it('should validate a session successfully when all conditions are met', async () => {
      (db.getSessionByToken as jest.Mock).mockResolvedValue(mockSession);
      const result = await SessionValidator.validateSession('valid-token', '192.168.1.1', 'Chrome');
      expect(result).toEqual(mockSession);
    });

    it('should throw an error if the session token is not found', async () => {
      (db.getSessionByToken as jest.Mock).mockResolvedValue(null);
      await expect(SessionValidator.validateSession('invalid-token', '1.1.1.1', 'Firefox')).rejects.toThrow('Session not found.');
    });
    
    it('should throw an error and invalidate the session if the IP address does not match (Session Binding)', async () => {
      (db.getSessionByToken as jest.Mock).mockResolvedValue(mockSession);
      const invalidateSpy = jest.spyOn(SessionValidator, 'invalidateSession');

      await expect(SessionValidator.validateSession('valid-token', '203.0.113.10', 'Chrome')).rejects.toThrow('Session context changed. Please log in again.');
      expect(invalidateSpy).toHaveBeenCalledWith('valid-token');
    });
  });

  describe('requireMFA', () => {
    it('should pass if the action is not sensitive', async () => {
      (db.getUser as jest.Mock).mockResolvedValue({ _id: 'user-123' });
      const result = await SessionValidator.requireMFA('user-123', 'view_dashboard');
      expect(result.status).toBe('passed');
      expect(db.isMfaVerifiedForSession).not.toHaveBeenCalled();
    });

    it('should throw an error if the action is sensitive and MFA is not verified', async () => {
      (db.getUser as jest.Mock).mockResolvedValue({ _id: 'user-123' });
      (db.isMfaVerifiedForSession as jest.Mock).mockResolvedValue(false);
      await expect(SessionValidator.requireMFA('user-123', 'place_bid')).rejects.toThrow('MFA required for this action');
    });
  });

  describe('detectSuspiciousLogin', () => {
    const currentLogin = {
        device: 'Desktop',
        ipAddress: '203.0.113.10',
        userAgent: 'Chrome',
        location: { lat: 34.0522, lon: -118.2437 }, // Los Angeles
        timestamp: new Date('2025-08-10T12:05:00.000Z'),
    };

    it('should validate a normal first-time login', async () => {
      (db.getLastLogin as jest.Mock).mockResolvedValue(null); // No previous login
      const result = await SessionValidator.detectSuspiciousLogin('user-123', currentLogin);
      
      expect(result.status).toBe('valid');
      expect(db.logLogin).toHaveBeenCalledWith('user-123', currentLogin);
      expect(db.lockAccount).not.toHaveBeenCalled();
    });

    it('should lock the account if a different device is detected', async () => {
      const lastLogin = { ...currentLogin, device: 'Mobile' };
      (db.getLastLogin as jest.Mock).mockResolvedValue(lastLogin);

      await expect(SessionValidator.detectSuspiciousLogin('user-123', currentLogin)).rejects.toThrow(/Suspicious login detected/);
      expect(db.lockAccount).toHaveBeenCalledWith('user-123');
      expect(db.notifyUser).toHaveBeenCalled();
    });

    it('should lock the account if impossible travel is detected (Geo-Velocity)', async () => {
      // Last login was in New York 5 minutes ago
      const lastLogin = {
        device: 'Desktop',
        ipAddress: '74.125.224.72',
        userAgent: 'Chrome',
        location: { lat: 40.7128, lon: -74.0060 }, // New York
        timestamp: new Date('2025-08-10T12:00:00.000Z'), // 5 minutes before current login
      };
      (db.getLastLogin as jest.Mock).mockResolvedValue(lastLogin);

      await expect(SessionValidator.detectSuspiciousLogin('user-123', currentLogin)).rejects.toThrow(/Suspicious login detected/);
      expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Impossible travel detected'));
      expect(db.lockAccount).toHaveBeenCalledWith('user-123');
    });
  });
});