/*
 * File: WelcomeNotification.test.ts
 * Path: C:\CFH\backend\tests\services\onboarding\WelcomeNotification.test.ts
 * Created: 2025-07-25 16:15 PDT
 * Author: Mini (AI Assistant)
 * Version: 1.0
 * Description: Jest tests for the WelcomeNotification service.
 * Artifact ID: test-svc-welcome-notification
 * Version ID: test-svc-welcome-notification-v1.0.0
 */

import { WelcomeNotification } from '@services/onboarding/WelcomeNotification';
import logger from '@utils/logger';

// Mock dependencies
jest.mock('@utils/logger');
jest.mock('@services/db', () => ({
  getUser: jest.fn(),
  logNotification: jest.fn(),
}));
jest.mock('@services/notifications', () => ({
  sendEmail: jest.fn(),
  sendPush: jest.fn(),
}));

describe('WelcomeNotification Service', () => {
  const db = require('@services/db');
  const notifications = require('@services/notifications');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should send a welcome email successfully', async () => {
    db.getUser.mockResolvedValue({ profile: { name: 'John Doe', email: 'john@test.com' } });
    const result = await WelcomeNotification.sendWelcomeEmail('user123');
    
    expect(result.status).toBe('email_sent');
    expect(notifications.sendEmail).toHaveBeenCalledWith('john@test.com', expect.stringContaining('John Doe'));
    expect(db.logNotification).toHaveBeenCalled();
  });

  it('should send a welcome push if enabled', async () => {
    db.getUser.mockResolvedValue({ settings: { notifications: { push: true } } });
    const result = await WelcomeNotification.sendWelcomePush('user123');

    expect(result.status).toBe('push_sent');
    expect(notifications.sendPush).toHaveBeenCalled();
  });

  it('should skip sending a push if disabled', async () => {
    db.getUser.mockResolvedValue({ settings: { notifications: { push: false } } });
    const result = await WelcomeNotification.sendWelcomePush('user123');

    expect(result.status).toBe('skipped');
    expect(notifications.sendPush).not.toHaveBeenCalled();
  });

  it('should throw an error if the user is not found', async () => {
    db.getUser.mockResolvedValue(null);
    await expect(WelcomeNotification.sendWelcomeEmail('baduser')).rejects.toThrow('User not found');
  });
});
