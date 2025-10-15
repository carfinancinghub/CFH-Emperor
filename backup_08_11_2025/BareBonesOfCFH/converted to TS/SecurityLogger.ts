// ----------------------------------------------------------------------
// File: SecurityLogger.ts
// Path: backend/services/security/SecurityLogger.ts
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// A centralized service for logging all security-related events with severity
// levels and strongly-typed, structured details.
//
// @usage
// Import and call `SecurityLogger.logSecurityEvent()` from any service or
// route where a security-relevant action occurs.
// e.g., `SecurityLogger.logSecurityEvent('LOGIN_FAILED', 'WARN', { userId, ipAddress })`
//
// @architectural_notes
// - This service uses a **Discriminated Union** for the 'details' object. This is a
//   powerful TypeScript pattern that enforces a specific shape for the 'details'
//   based on the 'eventType'. This is our standard for structured logging.
// - The introduction of **Severity Levels** allows for efficient querying and
//   alerting on the most critical security events.
//
// ----------------------------------------------------------------------

// --- COMMANDS ---
// @command: generate-test-suite
// @description: "Generates a full test suite for this service."
// @example: "npm run gen-suite -- --service=SecurityLogger --includeTests"

// --- FUTURE ENHANCEMENTS (TODO) ---
// @free:
//   - [ ] Add more event types and their corresponding detail schemas as new security features are built.
// @premium:
//   - [ ] ✨ Create a log rotation and archiving strategy to manage log storage costs over time.
// @wow:
//   - [ ] 🚀 Integrate this logger with a dedicated, external logging service like Splunk or Datadog for advanced, real-time log analysis and visualization.


import logger from '@/utils/logger';
import db from '@/services/db';

// --- Type Definitions ---
type LogSeverity = 'INFO' | 'WARN' | 'CRITICAL';

// ARCHITECTURAL UPGRADE: Structured, typed event details
type SecurityEventDetails = 
  | { eventType: 'LOGIN_SUCCESS'; details: { userId: string; ipAddress: string; } }
  | { eventType: 'LOGIN_FAILED'; details: { attemptedUserId: string; ipAddress: string; } }
  | { eventType: 'ACCOUNT_LOCKED'; details: { userId: string; reason: string; } }
  | { eventType: 'PASSWORD_RESET_REQUEST'; details: { userId: string; ipAddress: string; } };

// A generic type helper to extract the details object based on the event type
type DetailsFor<T extends SecurityEventDetails['eventType']> = Extract<SecurityEventDetails, { eventType: T }>['details'];

// --- Service Module ---
const SecurityLogger = {
  /**
   * Logs a security event to the database with a specific severity and structured details.
   */
  async logSecurityEvent<T extends SecurityEventDetails['eventType']>(
    eventType: T,
    severity: LogSeverity,
    details: DetailsFor<T>
  ): Promise<{ status: 'logged' }> {
    try {
      const event = {
        eventType,
        severity,
        details,
        timestamp: new Date(),
      };
      await db.logSecurityEvent(event);
      logger.info(`[SecurityLogger] Logged security event: ${eventType}`);
      return { status: 'logged' };
    } catch (err) {
      const error = err as Error;
      logger.error(`[SecurityLogger] Failed to log security event ${eventType}: ${error.message}`, error);
      throw error;
    }
  },

  /**
   * Retrieves security logs for a given date range.
   */
  async getSecurityLogs(startDate: Date, endDate: Date): Promise<any[]> {
    try {
      const logs = await db.getSecurityLogs(startDate, endDate);
      logger.info(`[SecurityLogger] Retrieved ${logs.length} security logs.`);
      return logs;
    } catch (err) {
      const error = err as Error;
      logger.error(`[SecurityLogger] Failed to retrieve security logs: ${error.message}`, error);
      throw error;
    }
  }
};

export default SecurityLogger;