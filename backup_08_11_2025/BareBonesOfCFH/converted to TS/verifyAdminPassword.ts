/*
 * File: verifyAdminPassword.ts
 * Path: C:\CFH\backend\scripts\verifyAdminPassword.ts
 * Created: 2025-07-25 17:00 PDT
 * Author: Mini (AI Assistant)
 * Version: 1.0
 * Description: A utility script to verify the admin password against the database hash.
 * Artifact ID: script-verify-admin-pass
 * Version ID: script-verify-admin-pass-v1.0.0
 */

// import mongoose from 'mongoose';
// import bcrypt from 'bcryptjs';
// import { User } from '@models/User'; // TODO: Create the User Mongoose model
// import dotenv from 'dotenv';

// dotenv.config();

// const MONGO_URI = process.env.MONGO_URI || 'mongodb://admin:admin123@127.0.0.1:27017/car-haul?authSource=admin';

// --- Placeholder Mocks for demonstration ---
const bcrypt = {
    compare: async (plain: string, hash: string) => plain === 'admin123' && hash === 'hashed_admin123'
};
const User = {
    findOne: async (query: { email: string }) => {
        if (query.email === 'admin@example.com') {
            return { email: 'admin@example.com', password: 'hashed_admin123' };
        }
        return null;
    }
};
const mongoose = {
    connect: async (uri: string) => console.log('MongoDB connected'),
    connection: { close: () => console.log('MongoDB connection closed') }
};
// --- End Mocks ---

export const verifyAdminPassword = async (email: string, plainPass: string): Promise<boolean> => {
  try {
    // Find the admin user
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`Admin user '${email}' not found.`);
      return false;
    }

    // Compare the password
    const isMatch = await bcrypt.compare(plainPass, user.password);
    if (isMatch) {
      console.log(`✅ Password matches for ${email}!`);
    } else {
      console.log(`❌ Password does not match for ${email}.`);
    }
    return isMatch;
  } catch (err) {
    console.error('Error verifying password:', err);
    return false;
  }
};

// This allows the script to be run directly from the command line
if (require.main === module) {
  (async () => {
    // await mongoose.connect(MONGO_URI);
    await verifyAdminPassword('admin@example.com', 'admin123');
    // await mongoose.connection.close();
  })();
}
