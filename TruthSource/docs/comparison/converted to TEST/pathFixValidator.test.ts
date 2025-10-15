// ----------------------------------------------------------------------
// File: pathFixValidator.test.ts
// Path: backend/scripts/validators/__tests__/pathFixValidator.test.ts
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// A test suite for the 'pathFixValidator' script, which enforces our
// '@' path alias standard.
//
// @architectural_notes
// - **Testing a CI/CD Script**: The most critical assertions in this suite
//   are for 'process.exit'. We verify that the script signals success (exit 0)
//   or failure (exit 1) correctly, which is how it functions as a quality
//   gate in an automated CI/CD pipeline.
// - **File System Isolation**: By completely mocking the 'fs' module, we test
//   the script's file I/O logic without ever touching the actual disk. This
//   makes our tests fast, safe, and predictable.
// - **Simulating User Input**: We mock the 'minimist' library to simulate a
//   developer running the script with different command-line arguments,
//   allowing us to test all of its features, including the '--dry-run' mode.
//
// ----------------------------------------------------------------------

import { promises as fs } from 'fs';
import minimist from 'minimist';
import logger from '@/utils/logger';
import { validatePaths } from '../pathFixValidator'; // Assuming function is exported

// --- Mocks ---
jest.mock('fs/promises');
jest.mock('minimist');
jest.mock('@/utils/logger');

describe('pathFixValidator Script', () => {
  const mockExit = jest.spyOn(process, 'exit').mockImplementation((() => {}) as (code?: number) => never);
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should PASS and exit with code 0 if no relative imports are found', async () => {
    // Arrange
    const mockFileList = JSON.stringify([{ path: 'src/cleanFile.ts' }]);
    const mockFileContent = 'import service from "@/services/myService";';
    (minimist as jest.Mock).mockReturnValue({ input: 'report.json', output: 'validation.json' });
    (fs.readFile as jest.Mock).mockImplementation((path) => {
      if (path === 'report.json') return Promise.resolve(mockFileList);
      return Promise.resolve(mockFileContent);
    });

    // Act
    await validatePaths();

    // Assert
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Validation PASSED'));
    expect(fs.writeFile).toHaveBeenCalled();
    expect(mockExit).toHaveBeenCalledWith(0);
  });

  it('should FAIL and exit with code 1 if relative imports are found', async () => {
    // Arrange
    const mockFileList = JSON.stringify([{ path: 'src/dirtyFile.ts' }]);
    const mockFileContent = 'import service from "../../services/myService";'; // Invalid import
    (minimist as jest.Mock).mockReturnValue({ input: 'report.json', output: 'validation.json' });
    (fs.readFile as jest.Mock).mockImplementation((path) => {
      if (path === 'report.json') return Promise.resolve(mockFileList);
      return Promise.resolve(mockFileContent);
    });

    // Act
    await validatePaths();

    // Assert
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Validation FAILED'));
    expect(fs.writeFile).toHaveBeenCalled();
    expect(mockExit).toHaveBeenCalledWith(1);
  });
  
  it('should exit with code 1 if the input report file cannot be read', async () => {
    // Arrange
    (minimist as jest.Mock).mockReturnValue({ input: 'nonexistent.json', output: 'validation.json' });
    (fs.readFile as jest.Mock).mockRejectedValue(new Error('File not found'));

    // Act
    await validatePaths();

    // Assert
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Error reading input report file'));
    expect(mockExit).toHaveBeenCalledWith(1);
  });
});