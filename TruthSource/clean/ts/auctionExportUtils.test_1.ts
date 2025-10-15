// File: auctionExportUtils.test.ts
// Path: frontend/src/tests/auctionExportUtils.test.ts
// Author: Cod5 (07212245, July 21, 2025, 22:45 PDT)
// Purpose: Unit tests for auctionExportUtils.ts to ensure reliable auction data and dispute summary exports

import { exportAuctionDataAsCSV, exportAuctionSummaryAsPDF, exportDisputeSummaryAsPDF } from '@utils/auction/auctionExportUtils';
import axios from '@utils/axios';
import { logError } from '@utils/logger';
import { toast } from '@utils/react-toastify';

// Mock dependencies
jest.mock('@utils/axios', () => ({
  post: jest.fn(),
}));
jest.mock('@utils/logger', () => ({ logError: jest.fn() }));
jest.mock('@utils/react-toastify', () => ({ toast: { success: jest.fn(), error: jest.fn() } }));

describe('auctionExportUtils', () => {
  const mockAuctions = [
    { id: '1', title: 'Toyota Camry', currentBid: 15000, timeRemaining: '2h 30m' },
    { id: '2', title: 'Honda Civic', currentBid: 12000, timeRemaining: '1h 15m' },
  ];
  const mockSummaryData = {
    totalAuctions: 2,
    totalBidValue: 27000,
    trendingVehicles: [{ make: 'Toyota', model: 'Camry', count: 1 }],
  };
  const mockVotes = [{ vote: 'for' }, { vote: 'against' }];

  beforeEach(() => {
    jest.clearAllMocks();
    (axios.post as jest.Mock).mockResolvedValue({ data: { url: 'mock-url' } });
  });

  it('exports auction data as CSV', async () => {
    const url = await exportAuctionDataAsCSV(mockAuctions);
    expect(axios.post).toHaveBeenCalledWith('/api/export/csv', {
      content: expect.stringContaining('ID,Title,Current Bid,Time Remaining'),
    });
    expect(toast.success).toHaveBeenCalledWith('Auction data exported as CSV!');
    expect(url).toBe('mock-url');
  });

  it('handles invalid auction data for CSV export', async () => {
    await expect(exportAuctionDataAsCSV(null)).rejects.toThrow('Invalid auction data');
    expect(toast.error).toHaveBeenCalledWith('Failed to export auction data as CSV.');
    expect(logError).toHaveBeenCalled();
  });

  it('exports auction summary as PDF', async () => {
    const url = await exportAuctionSummaryAsPDF(mockAuctions, mockSummaryData);
    expect(axios.post).toHaveBeenCalledWith('/api/export/pdf', expect.any(Object), { responseType: 'blob' });
    expect(toast.success).toHaveBeenCalledWith('Auction summary exported as PDF!');
    expect(url).toContain('blob:');
  });

  it('handles invalid auction summary data', async () => {
    await expect(exportAuctionSummaryAsPDF(null, null)).rejects.toThrow('Invalid auction or summary data');
    expect(toast.error).toHaveBeenCalledWith('Failed to export auction summary as PDF.');
    expect(logError).toHaveBeenCalled();
  });

  it('exports dispute summary as PDF', async () => {
    const url = await exportDisputeSummaryAsPDF('DISPUTE1', mockVotes);
    expect(axios.post).toHaveBeenCalledWith('/api/export/pdf/dispute', expect.any(Object), { responseType: 'blob' });
    expect(toast.success).toHaveBeenCalledWith('Dispute summary exported as PDF!');
    expect(url).toContain('blob:');
  });

  it('handles invalid dispute data', async () => {
    await expect(exportDisputeSummaryAsPDF('', null)).rejects.toThrow('Invalid dispute ID or votes data');
    expect(toast.error).toHaveBeenCalledWith('Failed to export dispute summary as PDF.');
    expect(logError).toHaveBeenCalled();
  });

  // === TODOs and Suggestions ===
  // - Add tests for export payload structure validation.
  // - Mock backend responses for more realistic API testing.
  // - Integrate with visual regression tests for PDF previews.
});