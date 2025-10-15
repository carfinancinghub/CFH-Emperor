// ----------------------------------------------------------------------
// File: recreateFiles.ts
// Path: backend/scripts/recreateFiles.ts
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// A professional-grade utility script for recreating a project structure
// from a single-file dump.
//
// @usage
// Run from the command line with arguments.
// To see what would be created without writing files:
// `ts-node backend/scripts/recreateFiles.ts --input=dump.txt --output=newProject --dry-run`
// To execute for real:
// `ts-node backend/scripts/recreateFiles.ts --input=dump.txt --output=newProject`
//
// @architectural_notes
// - **Professional Grade Tooling**: The script is no longer hardcoded. It accepts
//   command-line arguments for full flexibility.
// - **Safety First (Dry Run & Prompts)**: The addition of a `--dry-run` flag and
//   an interactive confirmation prompt are critical safety features that prevent
//   accidental file system changes. This is our standard for all file-writing scripts.
// - **Performance**: The script now uses asynchronous file system operations,
//   making it faster and non-blocking, especially for large projects.
//
// ----------------------------------------------------------------------

import { promises as fs } from 'fs';
import path from 'path';
import minimist from 'minimist';
import inquirer from 'inquirer';
import logger from '@/utils/logger';

/**
 * Main function to recreate project files from a dump.
 */
async function recreateProject() {
  const args = minimist(process.argv.slice(2));
  const { input, output, 'dry-run': isDryRun } = args;

  if (!input || !output) {
    logger.error('Usage: ts-node recreateFiles.ts --input=<inputFile> --output=<outputDir> [--dry-run]');
    return;
  }

  // ARCHITECTURAL UPGRADE: Interactive Safety Prompt
  if (!isDryRun) {
    const { confirmation } = await inquirer.prompt([
      { type: 'confirm', name: 'confirmation', message: `This will write files to '${output}'. Are you sure?`, default: false }
    ]);
    if (!confirmation) {
      logger.info('Operation cancelled by user.');
      return;
    }
  }

  logger.info(isDryRun ? '--- Starting Dry Run ---' : '--- Starting File Recreation ---');

  try {
    const data = await fs.readFile(input, 'utf8');
    const sections = data.split('=== FILE:');

    for (const section of sections) {
      if (!section.trim()) continue;

      const pathEndIndex = section.indexOf('===');
      if (pathEndIndex === -1) continue;

      const filePath = section.substring(0, pathEndIndex).trim();
      const fileContent = section.substring(pathEndIndex + 3).trim();
      const fullPath = path.join(output, filePath);
      const dir = path.dirname(fullPath);

      if (isDryRun) {
        logger.info(`[Dry Run] Would create directory: ${dir}`);
        logger.info(`[Dry Run] Would write file: ${fullPath}`);
      } else {
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(fullPath, fileContent);
        console.log(`Created: ${fullPath}`);
      }
    }
    
    logger.info(isDryRun ? '--- Dry Run Complete ---' : '--- All files recreated successfully ---');

  } catch (err) {
    const error = err as Error;
    logger.error(`Error recreating files: ${error.message}`);
    throw error; // Re-throw to exit with error code
  }
}

recreateProject().catch(() => process.exit(1));