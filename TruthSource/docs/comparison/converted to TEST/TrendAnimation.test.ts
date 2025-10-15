// File: TrendAnimation.test.ts
// Path: C:\CFH\backend\services\ai\__tests__\TrendAnimation.test.ts

// Mock dependencies before importing the module
const mockDb = {
  getAuctionData: jest.fn(),
};
const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
};
jest.mock('@services/db', () => mockDb);
jest.mock('@utils/logger', () => mockLogger);

const TrendAnimation = require('../TrendAnimation');

describe('TrendAnimation', () => {

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  const mockAuctionData = {
    startTime: '2025-05-24T10:00:00.000Z',
    bids: [
      { amount: 5000 },
      { amount: 15000 },
    ],
  };

  test('should generate trend data successfully for a valid auction', async () => {
    mockDb.getAuctionData.mockResolvedValue(mockAuctionData);
    
    const trendData = await TrendAnimation.generateTrendData('auction123');
    
    // Verify the structure of the returned data
    expect(trendData).toHaveLength(2);
    expect(trendData[0].count).toBe(5000);
    expect(trendData[0].style).toBe('gradient-blue');
    expect(trendData[1].count).toBe(15000);
    expect(trendData[1].style).toBe('gradient-red');
    
    // Verify the logger was called
    expect(mockLogger.info).toHaveBeenCalledWith('[TrendAnimation] Generated trend data for auctionId: auction123');
  });

  test('should throw an error if auction data is not found', async () => {
    mockDb.getAuctionData.mockResolvedValue(null);
    
    // Expect the function to throw an error
    await expect(TrendAnimation.generateTrendData('nonexistent-auction'))
      .rejects.toThrow('Auction data not found');
      
    // Verify the error was logged
    expect(mockLogger.error).toHaveBeenCalledWith('[TrendAnimation] Auction data not found for auctionId: nonexistent-auction');
  });
  
  test('should re-throw and log an error if the database call fails', async () => {
    const dbError = new Error('Database connection failed');
    mockDb.getAuctionData.mockRejectedValue(dbError);

    await expect(TrendAnimation.generateTrendData('auction123'))
      .rejects.toThrow('Database connection failed');

    // Verify the error was logged with details
    expect(mockLogger.error).toHaveBeenCalledWith(
      '[TrendAnimation] Failed to generate trend data for auctionId auction123: Database connection failed',
      dbError
    );
  });
});