// ----------------------------------------------------------------------
// File: pathFixValidator.ts
// Path: backend/scripts/validators/pathFixValidator.ts
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// A developer utility script that acts as a quality linter to enforce our
// standard of using '@' path aliases over relative '../../' paths.
//
// @usage
// This script is intended to be run as a quality gate in a CI/CD pipeline.
// `ts-node pathFixValidator.ts --input=report.json --output=validation.json`
// It will exit with code 1 if any invalid paths are found.
//
// @architectural_notes
// - **CI/CD Quality Gate**: This script is designed to exit with a non-zero
//   status code on failure, allowing it to automatically fail a build in a
//   CI/CD pipeline if a developer commits code with invalid import paths.
// - **Asynchronous Performance**: All file system operations have been refactored
//   to be asynchronous, ensuring the script runs efficiently on large codebases.
// - **Configurable & Reusable**: By accepting command-line arguments, this is
//   now a flexible and reusable tool for maintaining code quality.
//
// ----------------------------------------------------------------------

import { promises as fs } from 'fs';
import path from 'path';
import minimist from 'minimist';
import logger from '@/utils/logger';

// --- Type Definitions ---
interface FileReport {
  path: string;
}
interface ValidationResult {
  file: string;
  unresolvedImports: string[];
}

/**
 * Main validation function.
 */
async function validatePaths() {
  const args = minimist(process.argv.slice(2));
  const { input, output, 'dry-run': isDryRun } = args;

  if (!input || !output) {
    logger.error('Usage: ts-node pathFixValidator.ts --input=<reportPath> --output=<outputPath>');
    process.exit(1);
  }

  let fileList: FileReport[];
  try {
    const reportContent = await fs.readFile(input, 'utf8');
    fileList = JSON.parse(reportContent);
  } catch (err) {
    logger.error(`❌ Error reading input report file at ${input}:`, err);
    process.exit(1);
  }

  const suspiciousPattern = /import\s+.*?['"](\.\.\/)+.*?['"]/g;
  const results: ValidationResult[] = [];

  for (const file of fileList) {
    try {
      const content = await fs.readFile(file.path, 'utf8');
      const matches = content.match(suspiciousPattern);

      if (matches && matches.length > 0) {
        results.push({
          file: file.path,
          unresolvedImports: matches,
        });
      }
    } catch (err) {
      logger.warn(`⚠️ Could not read or process file ${file.path}. Skipping.`);
    }
  }

  await fs.writeFile(output, JSON.stringify(results, null, 2), 'utf8');

  if (results.length > 0) {
    logger.error(`❌ Validation FAILED: Found ${results.length} files with relative imports.`);
    console.log('Report saved to:', output);
    process.exit(1); // Exit with failure code for CI/CD
  } else {
    logger.info('✅ Validation PASSED: All import paths meet the standard.');
    process.exit(0); // Exit with success code
  }
}

validatePaths();