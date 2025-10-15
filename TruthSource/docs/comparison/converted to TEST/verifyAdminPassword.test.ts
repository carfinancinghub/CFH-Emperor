/*
 * File: verifyAdminPassword.test.ts
 * Path: C:\CFH\backend\tests\scripts\verifyAdminPassword.test.ts
 * Created: 2025-07-25 17:00 PDT
 * Author: Mini (AI Assistant)
 * Version: 1.0
 * Description: Jest tests for the verifyAdminPassword script.
 * Artifact ID: test-script-verify-admin-pass
 * Version ID: test-script-verify-admin-pass-v1.0.0
 */

import { verifyAdminPassword } from '@scripts/verifyAdminPassword';

// Mock dependencies
jest.mock('@models/User', () => ({
  findOne: jest.fn(),
}));
jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

describe('verifyAdminPassword Script', () => {
  const User = require('@models/User');
  const bcrypt = require('bcryptjs');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return true if the password matches', async () => {
    User.findOne.mockResolvedValue({ password: 'hashed_password' });
    bcrypt.compare.mockResolvedValue(true);

    const result = await verifyAdminPassword('admin@test.com', 'correct_password');
    expect(result).toBe(true);
  });

  it('should return false if the password does not match', async () => {
    User.findOne.mockResolvedValue({ password: 'hashed_password' });
    bcrypt.compare.mockResolvedValue(false);

    const result = await verifyAdminPassword('admin@test.com', 'wrong_password');
    expect(result).toBe(false);
  });

  it('should return false if the user is not found', async () => {
    User.findOne.mockResolvedValue(null);
    const result = await verifyAdminPassword('notfound@test.com', 'any_password');
    expect(result).toBe(false);
  });
});
