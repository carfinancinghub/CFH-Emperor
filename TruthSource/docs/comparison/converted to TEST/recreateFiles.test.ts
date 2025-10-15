// ----------------------------------------------------------------------
// File: recreateFiles.test.ts
// Path: backend/scripts/__tests__/recreateFiles.test.ts
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// A test suite for the professional-grade project recreation script.
//
// @architectural_notes
// - **Testing Interactive Scripts**: This suite demonstrates how to test a
//   command-line tool by mocking 'minimist' (for arguments) and 'inquirer'
//   (for user prompts).
// - **File System Isolation**: By completely mocking the 'fs' module, we can
//   test the script's file-writing logic without touching the actual file
//   system, making the tests fast and safe.
// - **Testing Safety Features**: We have a dedicated test for the '--dry-run'
//   mode to ensure this critical safety feature is working as intended.
//
// ----------------------------------------------------------------------

import { promises as fs } from 'fs';
import minimist from 'minimist';
import inquirer from 'inquirer';
import { recreateProject } from '../recreateFiles'; // Assuming function is exported

// --- Mocks ---
jest.mock('fs/promises', () => ({
  readFile: jest.fn(),
  mkdir: jest.fn(),
  writeFile: jest.fn(),
}));
jest.mock('minimist');
jest.mock('inquirer');
jest.mock('@utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

describe('recreateFiles Script', () => {
  const mockFileData = '=== FILE: src/index.js ===\nconsole.log("hello");';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should perform a dry run without writing any files', async () => {
    (minimist as jest.Mock).mockReturnValue({
      input: 'dump.txt',
      output: 'newProject',
      'dry-run': true,
    });
    (fs.readFile as jest.Mock).mockResolvedValue(mockFileData);

    await recreateProject();

    expect(inquirer.prompt).not.toHaveBeenCalled(); // Prompt should be skipped
    expect(fs.mkdir).not.toHaveBeenCalled();
    expect(fs.writeFile).not.toHaveBeenCalled();
  });

  it('should write files correctly when user confirms the prompt', async () => {
    (minimist as jest.Mock).mockReturnValue({ input: 'dump.txt', output: 'newProject' });
    (fs.readFile as jest.Mock).mockResolvedValue(mockFileData);
    (inquirer.prompt as jest.Mock).mockResolvedValue({ confirmation: true });

    await recreateProject();

    expect(inquirer.prompt).toHaveBeenCalledTimes(1);
    expect(fs.mkdir).toHaveBeenCalledWith('newProject/src', { recursive: true });
    expect(fs.writeFile).toHaveBeenCalledWith('newProject/src/index.js', 'console.log("hello");');
  });

  it('should cancel the operation if the user denies the prompt', async () => {
    (minimist as jest.Mock).mockReturnValue({ input: 'dump.txt', output: 'newProject' });
    (inquirer.prompt as jest.Mock).mockResolvedValue({ confirmation: false });

    await recreateProject();

    expect(inquirer.prompt).toHaveBeenCalledTimes(1);
    expect(fs.writeFile).not.toHaveBeenCalled();
  });

  it('should show a usage error if input or output arguments are missing', async () => {
    (minimist as jest.Mock).mockReturnValue({ input: 'dump.txt' }); // Missing output
    
    await recreateProject();

    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Usage:'));
  });
});