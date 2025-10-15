/**
 * © 2025 CFH, All Rights Reserved
 * File: AuctionHistoryTracker.test.tsx
 * Path: C:\CFH\frontend\src\components\auction\core\AuctionHistoryTracker.test.tsx
 * Purpose: Validate AuctionHistoryTracker with premium and non-premium scenarios
 * Author: [Your Name]
 * Date: 2025-08-09 0945
 * Version: 1.0.0
 * Version ID: d4e3c2b1-a0f9-8e7d-6c5b-4a3f2c1d0e9f
 * Crown Certified: Yes
 * Batch ID: CFH-AE-2025Q3
 * Artifact ID: 5a4b3c2d-1e0f-9a8b-7c6d-5e4f3a2b1c0d
 * Save Location: C:\CFH\frontend\src\components\auction\core\AuctionHistoryTracker.test.tsx
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AuctionHistoryTracker from '@/components/auction/core/AuctionHistoryTracker';

jest.mock('@/components/common/HeatmapChart', () => ({ __esModule: true, default: ({ isPremium }: { isPremium: boolean }) => <div>{isPremium ? 'HeatmapChart' : 'Upgrade Heatmap'}</div> }));
jest.mock('@/components/common/BlockchainSnapshotViewer', () => ({ __esModule: true, default: ({ isPremium }: { isPremium: boolean }) => <div>{isPremium ? 'BlockchainSnapshotViewer' : 'Upgrade Blockchain'}</div> }));
jest.mock('@/components/auction/SellerBadgePanel', () => ({ __esModule: true, default: ({ isPremium }: { isPremium: boolean }) => <div>{isPremium ? 'SellerBadgePanel' : 'Upgrade Badges'}</div> }));

describe('AuctionHistoryTracker', () => {
  const mockProps = {
    bidHistory: [
      { time: '2025-05-12T12:00:00Z', amount: 5400 },
      { time: '2025-05-12T12:05:00Z', amount: 5500 },
    ],
    heatmapData: [{ timeWindow: '12:00-12:05', bidCount: 2 }],
    snapshot: { '2025-05-12T12:00:00Z': 5400 },
    sellerStats: { winRate: 87, bidVelocity: 3.2, engagementScore: 91 },
    isPremium: true,
  };

  it('renders all premium components when isPremium is true', () => {
    render(<AuctionHistoryTracker {...mockProps} />);
    expect(screen.getByText('HeatmapChart')).toBeInTheDocument();
    expect(screen.getByText('BlockchainSnapshotViewer')).toBeInTheDocument();
    expect(screen.getByText('SellerBadgePanel')).toBeInTheDocument();
  });

  it('renders locked messages when isPremium is false', () => {
    render(<AuctionHistoryTracker {...mockProps} isPremium={false} />);
    expect(screen.getByText('Upgrade Heatmap')).toBeInTheDocument();
    expect(screen.getByText('Upgrade Blockchain')).toBeInTheDocument();
    expect(screen.getByText('Upgrade Badges')).toBeInTheDocument();
  });

  it('renders bid history list', () => {
    render(<AuctionHistoryTracker {...mockProps} />);
    expect(screen.getByText(/2025-05-12T12:00:00Z/i)).toBeInTheDocument();
    expect(screen.getByText(/5400/i)).toBeInTheDocument();
  });
});
