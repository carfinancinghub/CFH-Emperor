// File: seed.ts
// Path: backend/scripts/seed.ts
// Purpose: The master seeding script for the entire application.
// Author: Mini, System Architect
// Date: August 10, 2025
// 👑 Cod1 Crown Certified — Modular, configurable, and uses decoupled models.

// To Run: ts-node backend/scripts/seed.ts --scope=all
// To Run a specific seeder: ts-node backend/scripts/seed.ts --scope=auctions

import mongoose from 'mongoose';
import 'dotenv/config';
import minimist from 'minimist';

// ARCHITECTURAL UPGRADE: Models are now decoupled and imported
import Car from '@/models/Car';
import Auction from '@/models/Auction';
import User from '@/models/User';
// ... import other models like Loan, Offer, Delivery, etc.

const MONGO_URI = process.env.MONGO_URI || '';

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(MONGO_URI);
  console.log('🌱 MongoDB connected for seeding...');
};

const seedCars = async () => {
  await Car.deleteMany({});
  const cars = await Car.insertMany([
    { make: 'Tesla', model: 'Cybertruck', year: 2024, price: 95000, seller: 'seller-1', status: 'Available' },
    { make: 'Rivian', model: 'R1T', year: 2023, price: 82000, seller: 'seller-2', status: 'Available' },
  ]);
  console.log('🚗 Cars seeded.');
  return cars;
};

const seedAuctions = async () => {
  // ARCHITECTURAL UPGRADE: Uses dynamic, interconnected data
  const cars = await Car.find({ status: 'Available' }).limit(2);
  if (cars.length < 2) {
    console.warn('⚠️ Not enough cars to seed auctions. Run the car seeder first.');
    return;
  }
  
  await Auction.deleteMany({});
  await Auction.insertMany([
    { carId: cars[0]._id, startingPrice: 80000, status: 'active' },
    { carId: cars[1]._id, startingPrice: 75000, status: 'active' },
  ]);
  console.log('🔨 Auctions seeded.');
};

const seedAll = async () => {
  console.log('--- Starting full database seed ---');
  await seedCars();
  await seedAuctions();
  // ... call other seeders like seedUsers(), seedLoans() etc.
  console.log('--- Full database seed complete ---');
};

const main = async () => {
  try {
    const args = minimist(process.argv.slice(2));
    await connectDB();

    switch (args.scope) {
      case 'cars':
        await seedCars();
        break;
      case 'auctions':
        await seedAuctions();
        break;
      case 'all':
      default:
        await seedAll();
        break;
    }
  } catch (err) {
    const error = err as Error;
    console.error('🔥 Seeding failed:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed.');
    process.exit(0);
  }
};

main();