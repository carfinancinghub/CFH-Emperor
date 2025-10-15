// File: haulerBucket.test.ts
// Path: frontend/src/tests/haulerBucket.test.ts
// Author: Cod5 (07212245, July 21, 2025, 22:45 PDT)
// Purpose: Unit tests for haulerBucket.ts to ensure reliable aggregation and retrieval of hauler transport data

import { aggregateHaulerTransports, retrieveHaulerBucket } from '@archive/hauler/haulerBucket';
import { logError } from '@utils/logger';

// Mock dependencies
jest.mock('@utils/logger', () => ({
  logError: jest.fn(),
}));

describe('haulerBucket', () => {
  const mockTransports = [
    { id: '1', type: 'Flatbed', price: 1000, date: '2025-07-01' },
    { id: '2', type: 'Enclosed', price: 2000, date: '2025-07-02' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('aggregates transport history correctly', () => {
    const result = aggregateHaulerTransports(mockTransports);
    expect(result).toEqual({
      totalTransports: 2,
      totalValue: 3000,
      averagePrice: 1500,
      transportTypes: { Flatbed: 1, Enclosed: 1 },
    });
  });

  it('handles empty transport array', () => {
    const result = aggregateHaulerTransports([]);
    expect(result).toEqual({
      totalTransports: 0,
      totalValue: 0,
      averagePrice: 0,
      transportTypes: {},
    });
  });

  it('throws error for invalid transport data', () => {
    expect(() => aggregateHaulerTransports(null)).toThrow('Invalid transport data: must be an array');
    expect(logError).toHaveBeenCalled();
  });

  it('retrieves bucket data correctly', () => {
    const bucket = { totalTransports: 2, totalValue: 3000, averagePrice: 1500, transportTypes: { Flatbed: 1 } };
    const result = retrieveHaulerBucket(bucket);
    expect(result).toEqual(bucket);
    expect(result).not.toBe(bucket); // Ensures a copy is returned
  });

  it('throws error for invalid bucket data', () => {
    expect(() => retrieveHaulerBucket(null)).toThrow('Invalid bucket data');
    expect(logError).toHaveBeenCalled();
  });

  // === TODOs and Suggestions ===
  // - Add tests for edge cases (e.g., malformed transport objects).
  // - Mock a database connection to test persistence if revived for production.
  // - Integrate with @utils/auctionExportUtils to test export compatibility.
});