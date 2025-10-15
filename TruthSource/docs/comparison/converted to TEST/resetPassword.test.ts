// File: resetPassword.test.ts
// Path: backend/scripts/__tests__/resetPassword.test.ts
// Purpose: Tests for the interactive and configurable password reset script.

// --- Mocks ---
// We need to mock the entire module to test the main function
jest.mock('mongoose', () => ({
  connect: jest.fn().mockResolvedValue(true),
  connection: { close: jest.fn().mockResolvedValue(true) },
}));
jest.mock('bcryptjs', () => ({ hash: jest.fn().mockResolvedValue('hashed_password_123') }));
jest.mock('@/models/User', () => ({ findOneAndUpdate: jest.fn() }));
jest.mock('minimist', () => jest.fn());
jest.mock('inquirer', () => ({ prompt: jest.fn() }));

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import minimist from 'minimist';
import inquirer from 'inquirer';
// Import the main function from the script. We'll need to export it from the script file.
// In resetPassword.ts, add `export { resetPassword };`
import { resetPassword } from '../resetPassword'; 

describe('resetPassword Script', () => {

  // Mock process.exit and console to prevent the test runner from stopping and to capture output
  const mockExit = jest.spyOn(process, 'exit').mockImplementation((() => {}) as (code?: number) => never);
  const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
  const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully reset a password when the user confirms', async () => {
    (minimist as jest.Mock).mockReturnValue({ email: 'admin@test.com', password: 'newpass' });
    (inquirer.prompt as jest.Mock).mockResolvedValue({ confirmation: true });
    (User.findOneAndUpdate as jest.Mock).mockResolvedValue({ email: 'admin@test.com' });

    await resetPassword();

    expect(bcrypt.hash).toHaveBeenCalledWith('newpass', 10);
    expect(User.findOneAndUpdate).toHaveBeenCalledWith(
      { email: 'admin@test.com' },
      { password: 'hashed_password_123' },
      expect.any(Object)
    );
    expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('✅ User password updated/created for: admin@test.com'));
  });

  it('should cancel the operation if the user does not confirm', async () => {
    (minimist as jest.Mock).mockReturnValue({ email: 'admin@test.com', password: 'newpass' });
    (inquirer.prompt as jest.Mock).mockResolvedValue({ confirmation: false });

    await resetPassword();

    expect(mockConsoleLog).toHaveBeenCalledWith('🚫 Operation cancelled.');
    expect(User.findOneAndUpdate).not.toHaveBeenCalled();
    expect(mockExit).toHaveBeenCalledWith(0);
  });

  it('should exit with an error if --email argument is missing', async () => {
    (minimist as jest.Mock).mockReturnValue({ password: 'newpass' }); // Missing email

    await resetPassword();

    expect(mockConsoleError).toHaveBeenCalledWith(expect.stringContaining('Please provide --email and --password arguments.'));
    expect(mockExit).toHaveBeenCalledWith(1);
  });
});