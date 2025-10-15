// ----------------------------------------------------------------------
// File: resetPassword.ts
// Path: backend/scripts/resetPassword.ts
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// A secure, configurable script for resetting a user's password.
// Intended for administrative use in development or for initial setup.
//
// @usage
// Run from the command line with required arguments:
// `ts-node backend/scripts/resetPassword.ts --email=admin@example.com --password=newSecret123`
//
// @architectural_notes
// - **Configurable via Arguments**: The script is now a flexible tool that
//   accepts arguments, rather than using hardcoded values.
// - **Interactive Safety Prompt**: The script uses an interactive confirmation
//   prompt to prevent accidental execution on the wrong user or environment.
//   This is our standard for any potentially destructive administrative script.
// - **Enhanced Security Awareness**: The script includes a prominent warning
//   about its use in production environments.
//
// ----------------------------------------------------------------------

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import 'dotenv/config';
import minimist from 'minimist';
import inquirer from 'inquirer';

const MONGO_URI = process.env.MONGO_URI || '';

const resetPassword = async () => {
  // ARCHITECTURAL UPGRADE: Configurable via Arguments
  const args = minimist(process.argv.slice(2));
  const { email, password } = args;

  if (!email || !password) {
    console.error('❌ Error: Please provide --email and --password arguments.');
    process.exit(1);
  }

  // ARCHITECTURAL UPGRADE: Enhanced Security Awareness
  console.log('\x1b[33m%s\x1b[0m', '⚠️ WARNING: You are about to modify user credentials.');
  console.log('\x1b[33m%s\x1b[0m', 'Ensure this is not a production database unless you are authorized.');

  // ARCHITECTURAL UPGRADE: Interactive Safety Prompt
  const { confirmation } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmation',
      message: `Are you sure you want to reset the password for ${email}?`,
      default: false,
    },
  ]);

  if (!confirmation) {
    console.log('🚫 Operation cancelled.');
    process.exit(0);
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected');

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`✅ User password updated/created for: ${admin.email}`);
  } catch (err) {
    console.error('❌ Error resetting password:', err);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed.');
  }
};

resetPassword();