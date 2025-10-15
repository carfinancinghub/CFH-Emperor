// File: SessionValidator.ts
// Path: backend/services/security/SessionValidator.ts
// Purpose: A comprehensive service for session validation, MFA, and threat detection.
// Author: Mini, System Architect
// Date: August 10, 2025
// 👑 Cod1 Crown Certified — Multi-layered, policy-driven, and architecturally sound.

// TODO:
// @free:
//   - [ ] Implement the actual Mongoose models for User, Session, and LoginRecord.
//   - [ ] Integrate a real Geo-IP lookup service to convert IP addresses to coordinates.
// @premium:
//   - [ ] ✨ Develop a user-facing "Security Dashboard" where users can review their login history and active sessions, and remotely invalidate a session.
// @wow:
//   - [ ] 🚀 Integrate this service with a machine learning model that learns a user's normal behavior (typical login times, locations, actions) to detect anomalies with even greater accuracy.

import logger from '@/utils/logger';
import db from '@/services/db'; // Placeholder for your database service

// --- ARCHITECTURAL UPGRADE: Centralized Security Policy ---
// This configuration should be moved to a dedicated file (e.g., /config/security.ts)
const securityPolicy = {
  mfaRequiredActions: ['place_bid', 'initiate_payment', 'update_profile'],
  suspiciousLogin: {
    maxTravelSpeedKph: 800, // Max plausible travel speed (e.g., commercial flight)
  },
};

// --- Type Definitions ---
interface IUser { _id: string; }
interface ISession { 
  token: string; 
  expiresAt: Date; 
  ipAddress: string;
  userAgent: string;
}
interface ILoginRecord { 
  device: string; 
  ipAddress: string; 
  userAgent: string; 
  location: { lat: number; lon: number; }; 
  timestamp: Date; 
}
interface LoginDetails extends ILoginRecord {}

// --- Private Helper Functions ---

/**
 * Calculates the distance between two geographical coordinates (Haversine formula).
 * @private
 */
const _getDistanceInKm = (loc1: {lat: number, lon: number}, loc2: {lat: number, lon: number}): number => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (loc2.lat - loc1.lat) * (Math.PI / 180);
    const dLon = (loc2.lon - loc1.lon) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(loc1.lat * (Math.PI / 180)) * Math.cos(loc2.lat * (Math.PI / 180)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};


// --- Service Module ---
const SessionValidator = {

  /**
   * Validates a session token, including expiration and session binding.
   */
  async validateSession(sessionToken: string, ipAddress: string, userAgent: string): Promise<ISession> {
    const session: ISession | null = await db.getSessionByToken(sessionToken);

    if (!session) throw new Error('Session not found.');
    if (new Date(session.expiresAt) < new Date()) throw new Error('Session expired.');
    
    // ARCHITECTURAL UPGRADE: Session Binding
    if (session.ipAddress !== ipAddress || session.userAgent !== userAgent) {
      // If context changes, invalidate immediately and alert the user.
      await this.invalidateSession(sessionToken);
      logger.warn(`[SessionValidator] Session binding failed for token ${sessionToken}. Session invalidated.`);
      throw new Error('Session context changed. Please log in again.');
    }

    logger.info(`[SessionValidator] Validated session for token: ${sessionToken}`);
    return session;
  },

  /**
   * Invalidates a specific session token (logs a user out).
   */
  async invalidateSession(sessionToken: string): Promise<{ status: 'invalidated' }> {
    await db.invalidateSessionByToken(sessionToken);
    logger.info(`[SessionValidator] Invalidated session for token: ${sessionToken}`);
    return { status: 'invalidated' };
  },

  /**
   * Enforces MFA for sensitive actions based on the centralized security policy.
   */
  async requireMFA(userId: string, action: string): Promise<{ status: 'passed' }> {
    const user: IUser | null = await db.getUser(userId);
    if (!user) throw new Error('User not found');

    // ARCHITECTURAL UPGRADE: Reads from the Centralized Security Policy
    if (securityPolicy.mfaRequiredActions.includes(action)) {
      const isMfaVerified = await db.isMfaVerifiedForSession(userId); // Assumes DB check
      if (!isMfaVerified) {
        throw new Error('MFA required for this action');
      }
    }

    logger.info(`[SessionValidator] MFA check passed for userId: ${userId}, action: ${action}`);
    return { status: 'passed' };
  },

  /**
   * Detects suspicious logins using device, location, and geo-velocity checks.
   */
  async detectSuspiciousLogin(userId: string, loginDetails: LoginDetails): Promise<{ status: 'valid' | 'locked' }> {
    const lastLogin: ILoginRecord | null = await db.getLastLogin(userId);

    if (lastLogin) {
      let isSuspicious = false;
      const timeDiffHours = (new Date().getTime() - new Date(lastLogin.timestamp).getTime()) / (1000 * 3600);

      // Simple check for different device or user agent
      if (lastLogin.device !== loginDetails.device || lastLogin.userAgent !== loginDetails.userAgent) {
        isSuspicious = true;
      }
      
      // ARCHITECTURAL UPGRADE: Geo-Velocity Anomaly Detection
      if (timeDiffHours > 0) {
        const distanceKm = _getDistanceInKm(lastLogin.location, loginDetails.location);
        const speedKph = distanceKm / timeDiffHours;
        if (speedKph > securityPolicy.suspiciousLogin.maxTravelSpeedKph) {
          isSuspicious = true;
          logger.warn(`[SessionValidator] Impossible travel detected for userId: ${userId}. Speed: ${speedKph} kph.`);
        }
      }

      if (isSuspicious) {
        await db.lockAccount(userId);
        await db.notifyUser(userId, { type: 'suspicious_login', details: loginDetails });
        logger.warn(`[SessionValidator] Suspicious login detected for userId: ${userId}. Account locked.`);
        throw new Error('Suspicious login detected. Your account has been temporarily locked for your protection.');
      }
    }

    await db.logLogin(userId, loginDetails);
    logger.info(`[SessionValidator] Login validated for userId: ${userId}`);
    return { status: 'valid' };
  }
};

export default SessionValidator;