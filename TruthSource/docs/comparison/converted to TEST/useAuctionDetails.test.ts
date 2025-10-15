// ----------------------------------------------------------------------
// File: useAuctionDetails.test.ts
// Path: frontend/src/tests/hooks/useAuctionDetails.test.ts
// Author: Gemini & SG Man, System Architects
// Created: August 12, 2025 at 10:12 PDT
// Version: 1.0.0 (Initial Implementation)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// Test suite for the useAuctionDetails hook, verifying auction fetching and bidding functionality.
//
// @architectural_notes
// - **Comprehensive Mocking**: Mocks axios and useAuth for isolated unit testing.
// - **Behavior-Driven**: Tests user behaviors like viewing auction details, placing bids, and handling errors.
// - **Edge Cases**: Covers unauthenticated users and API failures.
//
// @todos
// - @free:
//   - [x] Test auction fetching and bidding.
// - @premium:
//   - [ ] ✨ Test WebSocket integration for real-time updates.
// - @wow:
//   - [ ] 🚀 Test AI-suggested bid amounts.
//
// ----------------------------------------------------------------------
import { renderHook, act } from '@testing-library/react-hooks';
import axios from 'axios';
import { useAuctionDetails } from '@/hooks/useAuctionDetails';
import { useAuth } from '@/hooks/useAuth';

// --- Mocks ---
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
jest.mock('@/hooks/useAuth');
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('useAuctionDetails', () => {
  const mockAuction = {
    _id: 'auction123',
    listing: {
      make: 'Test',
      model: 'Car',
      year: 2023,
      photos: [{ url: 'photo.jpg', metadata: {} }],
      seller: { name: 'Seller', profile: { avatar: 'avatar.jpg' }, reputation: 4.5 },
    },
    auctionType: 'SALE',
    endTime: new Date().toISOString(),
    status: 'ACTIVE',
    bids: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({ user: { id: 'user123', token: 'fake-token', subscription: 'PREMIUM' } });
  });

  it('should fetch auction details successfully', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: { data: mockAuction } });
    const { result, waitForNextUpdate } = renderHook(() => useAuctionDetails('auction123'));

    expect(result.current.isLoading).toBe(true);
    await waitForNextUpdate();

    expect(result.current.auction).toEqual(mockAuction);
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(mockedAxios.get).toHaveBeenCalledWith('/api/v1/auctions/auction123', expect.any(Object));
  });

  it('should handle auction fetch failure', async () => {
    mockedAxios.get.mockRejectedValueOnce({ response: { status: 404, data: { message: 'Auction not found' } } });
    const { result, waitForNextUpdate } = renderHook(() => useAuctionDetails('auction123'));

    await waitForNextUpdate();

    expect(result.current.error).toBe('Auction not found');
    expect(result.current.auction).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('should place a bid successfully', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: { data: mockAuction } });
    mockedAxios.post.mockResolvedValueOnce({ status: 200 });
    const { result, waitForNextUpdate } = renderHook(() => useAuctionDetails('auction123'));

    await waitForNextUpdate();
    await act(async () => {
      await result.current.placeBid({ amount: 50000 });
    });

    expect(result.current.bidError).toBeNull();
    expect(result.current.isPlacingBid).toBe(false);
    expect(mockedAxios.post).toHaveBeenCalledWith(
      '/api/v1/auctions/auction123/bids',
      { amount: 50000 },
      expect.any(Object)
    );
    expect(mockedAxios.get).toHaveBeenCalledTimes(2); // Initial fetch + refetch
  });

  it('should handle unauthorized bid attempt', async () => {
    mockUseAuth.mockReturnValue({ user: null });
    const { result, waitForNextUpdate } = renderHook(() => useAuctionDetails('auction123'));

    await waitForNextUpdate();
    await act(async () => {
      await result.current.placeBid({ amount: 50000 });
    });

    expect(result.current.bidError).toBe('You must be logged in to place a bid.');
    expect(result.current.isPlacingBid).toBe(false);
    expect(mockedAxios.post).not.toHaveBeenCalled();
  });

  it('should handle bid placement failure', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: { data: mockAuction } });
    mockedAxios.post.mockRejectedValueOnce({ response: { status: 403, data: { message: 'Unauthorized to place bid' } } });
    const { result, waitForNextUpdate } = renderHook(() => useAuctionDetails('auction123'));

    await waitForNextUpdate();
    await act(async () => {
      await result.current.placeBid({ amount: 50000 });
    });

    expect(result.current.bidError).toBe('Unauthorized to place bid.');
    expect(result.current.isPlacingBid).toBe(false);
    expect(mockedAxios.post).toHaveBeenCalled();
  });
});

export default {};