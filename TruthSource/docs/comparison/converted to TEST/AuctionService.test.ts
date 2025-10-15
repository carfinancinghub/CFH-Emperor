// ----------------------------------------------------------------------
// File: AuctionService.test.ts
// Path: backend/tests/AuctionService.test.ts
// Author: Gemini & SG Man, System Architects
// Created: August 12, 2025 at 13:45 PDT
// Version: 1.0.0 (Initial Implementation)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// Test suite for AuctionService, covering auction fetching and bidding functionality.
//
// @architectural_notes
// - **Comprehensive Mocking**: Mocks Mongoose models and services for isolated unit testing.
// - **Behavior-Driven**: Tests admin and user behaviors like fetching auctions and placing bids.
// - **Edge Cases**: Covers invalid inputs, unauthorized actions, and expired auctions.
//
// @todos
// - @free:
//   - [x] Test auction fetching and bidding.
// - @premium:
//   - [ ] ✨ Test advanced filtering for getActiveAuctions.
// - @wow:
//   - [ ] 🚀 Test AI-driven auction recommendations.
//
// ----------------------------------------------------------------------
import { mocked } from 'jest-mock';
import AuctionService from '@/services/AuctionService';
import Auction, { IAuction } from '@/models/Auction';
import Bid from '@/models/Bid';
import HistoryService from '@/services/HistoryService';
import GamificationService from '@/services/GamificationService';
import WebSocketService from '@/services/WebSocketService';
import mongoose from 'mongoose';

jest.mock('@/models/Auction');
jest.mock('@/models/Bid');
jest.mock('@/services/HistoryService');
jest.mock('@/services/GamificationService');
jest.mock('@/services/WebSocketService');

const MockedAuction = mocked(Auction);
const MockedBid = mocked(Bid);
const MockedHistoryService = mocked(HistoryService);
const MockedGamificationService = mocked(GamificationService);
const MockedWebSocketService = mocked(WebSocketService);

describe('AuctionService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch active auctions with pagination', async () => {
    const mockAuctions = [
      { _id: 'auction1', status: 'ACTIVE', auctionType: 'SALE', listing: { make: 'Test', model: 'Car' } },
    ];
    MockedAuction.find.mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue(mockAuctions),
    } as any);
    MockedHistoryService.logAction.mockResolvedValue(undefined);

    const result = await AuctionService.getActiveAuctions({ page: 1, limit: 10 });

    expect(result).toEqual(mockAuctions);
    expect(MockedAuction.find).toHaveBeenCalledWith({ status: 'ACTIVE' });
    expect(MockedHistoryService.logAction).toHaveBeenCalledWith('anonymous', 'VIEW_AUCTIONS', { page: 1, limit: 10, type: undefined });
  });

  it('should fetch auction details with deep population', async () => {
    const mockAuction = {
      _id: 'auction123',
      status: 'ACTIVE',
      auctionType: 'SALE',
      seller: 'user123',
      listing: { make: 'Test', model: 'Car', photos: [], seller: { name: 'Seller' } },
      bids: [],
    };
    MockedAuction.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockAuction),
    } as any);
    MockedHistoryService.logAction.mockResolvedValue(undefined);

    const result = await AuctionService.getAuctionById('auction123', 'user456');

    expect(result).toEqual(mockAuction);
    expect(MockedAuction.findById).toHaveBeenCalledWith('auction123');
    expect(MockedHistoryService.logAction).toHaveBeenCalledWith('user456', 'VIEW_AUCTION_DETAILS', { auctionId: 'auction123' });
  });

  it('should throw AuctionError for invalid auction ID', async () => {
    await expect(AuctionService.getAuctionById('invalid')).rejects.toMatchObject({
      message: 'Invalid auction ID.',
      status: 400,
    });
  });

  it('should place a bid successfully', async () => {
    const mockAuction = {
      _id: 'auction123',
      status: 'ACTIVE',
      auctionType: 'SALE',
      seller: 'seller123',
      endTime: new Date(Date.now() + 10000),
      bids: [],
      save: jest.fn().mockResolvedValue(undefined),
    };
    const mockBid = { _id: 'bid123', auction: 'auction123', bidder: 'user123', amount: 50000 };
    MockedAuction.findById.mockResolvedValue(mockAuction);
    MockedBid.mockImplementation(() => ({ save: jest.fn().mockResolvedValue(mockBid) }));
    MockedHistoryService.logAction.mockResolvedValue(undefined);
    MockedGamificationService.logEvent.mockResolvedValue(undefined);
    MockedWebSocketService.emit.mockReturnValue(undefined);

    const result = await AuctionService.placeBid('user123', 'auction123', { amount: 50000 });

    expect(result).toEqual(mockAuction);
    expect(MockedBid).toHaveBeenCalledWith({
      auction: 'auction123',
      bidder: 'user123',
      bidType: 'SALE_PRICE',
      amount: 50000,
      serviceType: undefined,
      terms: undefined,
    });
    expect(mockAuction.bids).toContain('bid123');
    expect(mockAuction.save).toHaveBeenCalled();
    expect(MockedHistoryService.logAction).toHaveBeenCalledWith('user123', 'PLACE_BID', {
      auctionId: 'auction123',
      bidId: 'bid123',
      amount: 50000,
    });
    expect(MockedWebSocketService.emit).toHaveBeenCalledWith('auction:auction123', { event: 'NEW_BID', data: mockBid });
  });

  it('should throw AuctionError for expired auction', async () => {
    const mockAuction = {
      _id: 'auction123',
      status: 'ACTIVE',
      auctionType: 'SALE',
      seller: 'seller123',
      endTime: new Date(Date.now() - 10000),
    };
    MockedAuction.findById.mockResolvedValue(mockAuction);

    await expect(AuctionService.placeBid('user123', 'auction123', { amount: 50000 })).rejects.toMatchObject({
      message: 'Auction has ended.',
      status: 403,
    });
  });

  it('should throw AuctionError for bidding on own auction', async () => {
    const mockAuction = {
      _id: 'auction123',
      status: 'ACTIVE',
      auctionType: 'SALE',
      seller: 'user123',
      endTime: new Date(Date.now() + 10000),
    };
    MockedAuction.findById.mockResolvedValue(mockAuction);

    await expect(AuctionService.placeBid('user123', 'auction123', { amount: 50000 })).rejects.toMatchObject({
      message: 'You cannot bid on your own auction.',
      status: 403,
    });
  });
});

export default {};