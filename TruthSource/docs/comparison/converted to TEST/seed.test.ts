// File: seed.test.ts
// Path: backend/scripts/__tests__/seed.test.ts
// Purpose: Tests the logic and modularity of the master database seed script.
// Author: Mini, System Architect
// Date: August 10, 2025
// 👑 Cod1 Crown Certified — A test suite for critical developer tooling.

// --- Mocks ---
// Mock the database models to prevent any actual DB interaction
const mockCar = { deleteMany: jest.fn(), insertMany: jest.fn(), find: jest.fn() };
const mockAuction = { deleteMany: jest.fn(), insertMany: jest.fn() };
jest.mock('@/models/Car', () => mockCar);
jest.mock('@/models/Auction', () => mockAuction);

// Mock mongoose connect and close to prevent network connections
const mockMongoose = {
  connect: jest.fn().mockResolvedValue(true),
  connection: { close: jest.fn().mockResolvedValue(true) },
};
jest.mock('mongoose', () => mockMongoose);

// Mock minimist to control command-line arguments
import minimist from 'minimist';
jest.mock('minimist');

// Import the main function from our script
const { main } = require('../seed'); // Using require because it's a script

describe('Master Seed Script', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset process.argv for each test
    process.argv = ['node', 'seed.ts'];
  });

  it('should run the full seed process when scope is "all"', async () => {
    (minimist as jest.Mock).mockReturnValue({ scope: 'all' });
    mockCar.find.mockResolvedValue([{ _id: 'car1' }, { _id: 'car2' }]);

    await main();

    // Verify that all core seeding functions are called
    expect(mockCar.deleteMany).toHaveBeenCalled();
    expect(mockCar.insertMany).toHaveBeenCalled();
    expect(mockAuction.deleteMany).toHaveBeenCalled();
    expect(mockAuction.insertMany).toHaveBeenCalled();
  });
  
  it('should run only the auctions seeder when scope is "auctions"', async () => {
    (minimist as jest.Mock).mockReturnValue({ scope: 'auctions' });
    // Mock the data needed for the auction seeder to run
    mockCar.find.mockResolvedValue([{ _id: 'car1' }, { _id: 'car2' }]);

    await main();

    // Verify ONLY auction logic was called
    expect(mockAuction.deleteMany).toHaveBeenCalled();
    expect(mockAuction.insertMany).toHaveBeenCalled();
    // Verify car logic was NOT called (except for the find)
    expect(mockCar.deleteMany).not.toHaveBeenCalled();
    expect(mockCar.insertMany).not.toHaveBeenCalled();
  });

  it('should use dynamic car IDs when seeding auctions', async () => {
    (minimist as jest.Mock).mockReturnValue({ scope: 'auctions' });
    const dynamicCars = [{ _id: 'dynamic-car-id-1' }, { _id: 'dynamic-car-id-2' }];
    mockCar.find.mockResolvedValue(dynamicCars);
    
    await main();

    // Verify that the data passed to insertMany contains the dynamic IDs
    expect(mockAuction.insertMany).toHaveBeenCalledWith([
      expect.objectContaining({ carId: 'dynamic-car-id-1' }),
      expect.objectContaining({ carId: 'dynamic-car-id-2' }),
    ]);
  });
  
  it('should default to the full seed process if no scope is provided', async () => {
    (minimist as jest.Mock).mockReturnValue({}); // No arguments
    mockCar.find.mockResolvedValue([{ _id: 'car1' }, { _id: 'car2' }]);

    await main();

    expect(mockCar.insertMany).toHaveBeenCalled();
    expect(mockAuction.insertMany).toHaveBeenCalled();
  });
});