// @ai-generated via ai-orchestrator
This conversion maintains the original file structure, converts CJS (`require`/`module.exports`) to modern ESM (`import`/`export`) which is idiomatic for TypeScript, and replaces `PropTypes` with explicit interfaces.

## Backend Services (TS)

### File: BidHeatmapEngine.ts
```typescript
// File: BidHeatmapEngine.ts
// Path: @services/auction/BidHeatmapEngine.ts
// Purpose: Generate real-time bid heatmap data based on auction activity
// Author: Rivers Auction Team
// Date: May 12, 2025
// 👑 Cod2 Crown Certified

import logger from '@/utils/logger';

// --- Type Definitions ---
interface TimeRange {
  start: Date;
  end: Date;
}

interface HeatmapEntry {
  timeWindow: string;
  bidCount: number;
}
// --- End Type Definitions ---

/**
 * Generates bid frequency heatmap data.
 * @param auctionId - The unique ID of the auction.
 * @param timeRange - The time window for which to compute bid frequency.
 * @returns heatmapData - Array of time buckets with bid counts.
 */
async function generateBidHeatmapData(
  auctionId: string,
  timeRange: TimeRange
): Promise<HeatmapEntry[]> {
  try {
    if (!auctionId || !timeRange?.start || !timeRange?.end) {
      throw new Error('Invalid parameters: auctionId and time range are required');
    }

    // Mocked bid events (in real system, fetch from DB or analytics engine)
    const mockBidEvents: { timestamp: Date }[] = [
      { timestamp: new Date('2025-05-12T12:00:00Z') },
      { timestamp: new Date('2025-05-12T12:01:00Z') },
      { timestamp: new Date('2025-05-12T12:02:30Z') },
      { timestamp: new Date('2025-05-12T12:10:00Z') },
      { timestamp: new Date('2025-05-12T12:12:00Z') },
    ];

    const bucketSizeInMinutes = 5;
    const heatmapData: HeatmapEntry[] = [];
    
    // Ensure inputs are valid timestamps
    const start = new Date(timeRange.start).getTime();
    const end = new Date(timeRange.end).getTime();

    const bucketSizeMs = bucketSizeInMinutes * 60 * 1000;

    for (let t = start; t < end; t += bucketSizeMs) {
      const bucketStart = new Date(t);
      const bucketEnd = new Date(t + bucketSizeMs);

      const count = mockBidEvents.filter(event => {
        const time = event.timestamp.getTime();
        return time >= bucketStart.getTime() && time < bucketEnd.getTime();
      }).length;

      heatmapData.push({
        timeWindow: `${bucketStart.toISOString()} - ${bucketEnd.toISOString()}`,
        bidCount: count,
      });
    }

    return heatmapData;
  } catch (error) {
    logger.error('generateBidHeatmapData failed:', error as Error);
    return [];
  }
}

export { generateBidHeatmapData };
```

### File: AIBidStarter.ts
```typescript
// File: AIBidStarter.ts
// Path: backend/services/auction/AIBidStarter.ts
// Purpose: Suggest starting bid for auction listings based on vehicle details and market data
// Author: Rivers Auction Team
// Date: May 12, 2025
// 👑 Cod2 Crown Certified

import logger from '@/utils/logger';

// --- Type Definitions ---
interface Vehicle {
  make: string;
  model: string;
  year: number;
  mileage: number;
}

interface MarketData {
  recentBids: number[];
  seasonalFactor?: number;
  demandScore?: number;
}
// --- End Type Definitions ---

/**
 * Suggests a starting bid using vehicle data and market insights.
 * @returns Computed bid suggestion or null on failure.
 */
function suggestStartingBid(
  vehicle: Vehicle,
  marketData: MarketData
): number | null {
  try {
    const { make, model, year, mileage } = vehicle;
    const { recentBids, seasonalFactor, demandScore } = marketData;

    if (!make || !model || !year || !mileage || !Array.isArray(recentBids)) {
      throw new Error('Invalid vehicle or market data');
    }

    const avgRecentBid: number = recentBids.length
      ? recentBids.reduce((sum: number, bid) => sum + bid, 0) / recentBids.length
      : 5000;

    const basePrice = 10000 - (mileage * 0.05);
    // Using ?? for explicit nullish check, or || to match original JS behavior (which treats 0/null/undefined/false the same)
    const seasonalAdj = basePrice * (seasonalFactor ?? 1); 
    const demandAdj = seasonalAdj * (1 + (demandScore ?? 0));

    const finalSuggestedBid = Math.round((demandAdj + avgRecentBid) / 2);

    return finalSuggestedBid;
  } catch (error) {
    logger.error('suggestStartingBid failed:', error as Error);
    return null;
  }
}

export { suggestStartingBid };
```

### File: AuctionTemplateEngine.ts
```typescript
// File: AuctionTemplateEngine.ts
// Path: backend/services/auction/AuctionTemplateEngine.ts
// Purpose: Manage reusable listing templates for auction creation
// Author: Rivers Auction Team
// Date: May 12, 2025
// 👑 Cod2 Crown Certified

import logger from '@/utils/logger';

// --- Type Definitions ---
interface AuctionTemplate {
    description: string;
    images: string[];
    tags: string[];
    sellerId: string;
}
// --- End Type Definitions ---

// Simulated in-memory store
const templates: Record<string, AuctionTemplate> = {}; 

/**
 * Saves a new auction template.
 * @returns Unique ID of saved template or null on error.
 */
function saveTemplate(
    sellerId: string, 
    // Use Omit to define the template structure passed in, excluding the ID which is generated
    template: Omit<AuctionTemplate, 'sellerId'>
): string | null {
  try {
    if (!sellerId || typeof template !== 'object' || template === null) {
      throw new Error('Invalid input: sellerId and template object are required');
    }
    const templateId = `${sellerId}-${Date.now()}`;
    templates[templateId] = { ...template, sellerId };
    return templateId;
  } catch (error) {
    logger.error('saveTemplate failed:', error as Error);
    return null;
  }
}

/**
 * Retrieves a saved template by ID.
 * @returns Retrieved template object or null.
 */
function getTemplate(templateId: string): AuctionTemplate | null {
  try {
    if (!templateId || typeof templateId !== 'string') {
      throw new Error('Invalid templateId');
    }
    return templates[templateId] || null;
  } catch (error) {
    logger.error('getTemplate failed:', error as Error);
    return null;
  }
}

export { saveTemplate, getTemplate };
```

## Frontend Components (TSX)

### File: HeatmapChart.tsx
```tsx
// File: HeatmapChart.tsx
// Path: frontend/src/components/common/HeatmapChart.tsx
// Purpose: Visualize bid frequency as a heatmap for premium auction users
// Author: Rivers Auction Team
// Date: May 12, 2025
// 👑 Cod2 Crown Certified

import React from 'react';
import logger from '@/utils/logger';

// --- Type Definitions ---
interface HeatmapEntry {
    timeWindow: string;
    bidCount: number;
}

interface HeatmapChartProps {
    data: HeatmapEntry[];
    isPremium: boolean;
}
// --- End Type Definitions ---

/**
 * HeatmapChart component
 */
const HeatmapChart: React.FC<HeatmapChartProps> = ({ data, isPremium }) => {
  try {
    if (!isPremium) {
      return <div className="text-sm text-gray-500 italic">Premium feature — upgrade to unlock bid heatmaps.</div>;
    }

    if (!Array.isArray(data)) {
      throw new Error('Invalid heatmap data');
    }

    return (
      <div className="p-4 bg-white border rounded-md shadow">
        <h3 className="text-lg font-semibold mb-2">Bid Frequency Heatmap</h3>
        <ul className="space-y-1">
          {data.map((entry, idx) => (
            <li key={idx} className="text-sm text-gray-700">
              <span className="font-mono text-blue-800">{entry.timeWindow}</span>: {entry.bidCount} bids
            </li>
          ))}
        </ul>
      </div>
    );
  } catch (error) {
    logger.error('HeatmapChart render error:', error as Error);
    return <div className="text-red-600 text-sm">Error rendering heatmap</div>;
  }
};

export default HeatmapChart;
```

### File: BlockchainSnapshotViewer.tsx
```tsx
// File: BlockchainSnapshotViewer.tsx
// Path: frontend/src/components/common/BlockchainSnapshotViewer.tsx
// Purpose: Display immutable blockchain-based bid snapshot data for premium users
// Author: Rivers Auction Team
// Date: May 12, 2025
// 👑 Cod2 Crown Certified

import React from 'react';
import logger from '@/utils/logger';

// --- Type Definitions ---
// Snapshot is an object where keys are timestamps (strings) and values are bids (numbers).
interface BlockchainSnapshot {
    [timestamp: string]: number;
}

interface BlockchainSnapshotViewerProps {
    snapshot: BlockchainSnapshot;
    isPremium: boolean;
}
// --- End Type Definitions ---

/**
 * BlockchainSnapshotViewer Component
 */
const BlockchainSnapshotViewer: React.FC<BlockchainSnapshotViewerProps> = ({ snapshot, isPremium }) => {
  try {
    if (!isPremium) {
      return <div className="text-sm text-gray-500 italic">Premium feature — upgrade to unlock blockchain bid history.</div>;
    }

    if (!snapshot || typeof snapshot !== 'object') {
      throw new Error('Invalid snapshot format');
    }

    const entries = Object.entries(snapshot);

    return (
      <div className="p-4 border rounded bg-white shadow">
        <h3 className="text-lg font-semibold mb-2">Blockchain Bid Snapshot</h3>
        <ul className="text-sm space-y-1">
          {entries.map(([timestamp, bid], idx) => (
            <li key={idx} className="text-gray-700">
              <span className="font-mono text-indigo-700">{timestamp}</span>: {bid} USD
            </li>
          ))}
        </ul>
      </div>
    );
  } catch (error) {
    logger.error('BlockchainSnapshotViewer render error:', error as Error);
    return <div className="text-red-600 text-sm">Error rendering blockchain snapshot</div>;
  }
};

export default BlockchainSnapshotViewer;
```

### File: SellerBadgePanel.tsx
```tsx
// File: SellerBadgePanel.tsx
// Path: frontend/src/components/auction/SellerBadgePanel.tsx
// Purpose: Show gamified seller badges and rank visuals gated for premium users
// Author: Rivers Auction Team
// Date: May 12, 2025
// 👑 Cod2 Crown Certified

import React from 'react';
import logger from '@/utils/logger';

// --- Type Definitions ---
interface SellerStats {
    winRate: number;
    bidVelocity: number;
    engagementScore: number;
}

interface SellerBadgePanelProps {
    sellerStats: SellerStats;
    isPremium: boolean;
}
// --- End Type Definitions ---

/**
 * SellerBadgePanel Component
 */
const SellerBadgePanel: React.FC<SellerBadgePanelProps> = ({ sellerStats, isPremium }) => {
  try {
    if (!isPremium) {
      return <div className="text-sm text-gray-500 italic">Premium feature — upgrade to unlock seller badge analytics.</div>;
    }

    if (!sellerStats || typeof sellerStats !== 'object') {
      throw new Error('Invalid sellerStats input');
    }

    const { winRate, bidVelocity, engagementScore } = sellerStats;

    return (
      <div className="p-4 border rounded bg-white shadow">
        <h3 className="text-lg font-semibold mb-2">Seller Rank & Badge Panel</h3>
        <ul className="text-sm space-y-1">
          <li>🏆 Win Rate: <span className="font-medium">{winRate}%</span></li>
          <li>⚡ Bid Velocity: <span className="font-medium">{bidVelocity} bids/hour</span></li>
          <li>🔥 Engagement Score: <span className="font-medium">{engagementScore}/100</span></li>
        </ul>
      </div>
    );
  } catch (error) {
    logger.error('SellerBadgePanel render error:', error as Error);
    return <div className="text-red-600 text-sm">Error rendering seller badge panel</div>;
  }
};

export default SellerBadgePanel;
```

### File: AuctionListingForm.tsx
```tsx
// File: AuctionListingForm.tsx
// Path: frontend/src/components/auction/core/AuctionListingForm.tsx
// Purpose: Enhanced auction listing form with premium AI bid suggestions, templates, and scheduling
// Author: Rivers Auction Team
// Date: May 12, 2025
// 👑 Cod2 Crown Certified

import React, { useState, useEffect } from 'react';
import logger from '@/utils/logger';
import { suggestStartingBid } from '@services/auction/AIBidStarter';
import { saveTemplate } from '@services/auction/AuctionTemplateEngine'; 
// getTemplate was imported but unused in JS, removing unused import in TS

// --- Type Definitions ---
interface Vehicle {
    make: string;
    model: string;
    year: number;
    mileage: number;
}

interface AuctionListingFormProps {
    vehicle: Vehicle;
    isPremium: boolean;
}
// --- End Type Definitions ---

const AuctionListingForm: React.FC<AuctionListingFormProps> = ({ vehicle, isPremium }) => {
  // startingBid state can hold the suggested number or an empty string from initialization
  const [startingBid, setStartingBid] = useState<number | string>('');
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [scheduleTime, setScheduleTime] = useState('');

  useEffect(() => {
    const generateSuggestion = () => { // Changed to sync since suggestStartingBid is sync
      try {
        if (!isPremium) return;
        
        // Mock market data structure matching MarketData interface
        const suggestion = suggestStartingBid(vehicle, {
          recentBids: [5200, 5600, 5900],
          seasonalFactor: 1.05,
          demandScore: 0.12,
        });
        
        if (suggestion !== null) {
            setStartingBid(suggestion);
        }
      } catch (error) {
        logger.error('AI bid suggestion failed:', error as Error);
      }
    };
    generateSuggestion();
  }, [vehicle, isPremium]);

  const handleSaveTemplate = () => {
    try {
      // Template object matching Omit<AuctionTemplate, 'sellerId'>
      const id = saveTemplate('seller123', {
        description: 'Fast car with upgrades',
        tags: ['turbo', 'low-mileage'],
        images: ['car1.jpg', 'car2.jpg'],
      });
      setTemplateId(id);
    } catch (error) {
      logger.error('Template save error:', error as Error);
    }
  };

  const handleScheduleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScheduleTime(e.target.value);
  };

  return (
    <div className="p-4 border bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-2">Auction Listing</h2>

      <div className="mb-3">
        <label className="block font-medium">Suggested Starting Bid:</label>
        <input
          type="number"
          value={startingBid}
          readOnly
          className="border rounded px-2 py-1 text-gray-700 w-full"
        />
        {!isPremium && <p className="text-sm text-gray-500 italic">Premium feature — upgrade to unlock AI suggestions.</p>}
      </div>

      <div className="mb-3">
        <label className="block font-medium">Use Template:</label>
        <button
          onClick={handleSaveTemplate}
          disabled={!isPremium}
          className="bg-blue-600 text-white px-3 py-1 rounded disabled:bg-gray-300"
        >
          Save as Template
        </button>
        {templateId && <p className="text-xs text-green-600 mt-1">Template saved!</p>}
        {!isPremium && <p className="text-sm text-gray-500 italic">Premium feature — upgrade to use templates.</p>}
      </div>

      <div className="mb-3">
        <label className="block font-medium">Schedule Listing (UTC):</label>
        <input
          type="datetime-local"
          value={scheduleTime}
          onChange={handleScheduleTimeChange}
          disabled={!isPremium}
          className="border rounded px-2 py-1 text-gray-700 w-full"
        />
        {!isPremium && <p className="text-sm text-gray-500 italic">Premium feature — upgrade to enable scheduling bot.</p>}
      </div>

      <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded">Submit Listing</button>
    </div>
  );
};

export default AuctionListingForm;
```

### File: AuctionListingForm.test.tsx
```tsx
// File: AuctionListingForm.test.tsx
// Path: frontend/src/tests/auction/core/AuctionListingForm.test.tsx
// Purpose: Test suite for AuctionListingForm premium features (AI, template, scheduling)
// Author: Rivers Auction Team
// Date: May 12, 2025
// 👑 Cod2 Crown Certified

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AuctionListingForm from '@/components/auction/core/AuctionListingForm';
import { suggestStartingBid } from '@services/auction/AIBidStarter'; // Import to properly type mock

jest.mock('@services/auction/AIBidStarter', () => ({
  suggestStartingBid: jest.fn(() => 5500),
}));

jest.mock('@services/auction/AuctionTemplateEngine', () => ({
  saveTemplate: jest.fn(() => 'template-xyz'),
  getTemplate: jest.fn(() => ({ description: 'Mock', tags: [], images: [] })),
}));

describe('AuctionListingForm - Premium Feature Tests', () => {
  const mockVehicle = {
    make: 'Tesla',
    model: 'Model 3',
    year: 2022,
    mileage: 10000,
  };

  it('renders AI suggestion for premium users', async () => {
    render(<AuctionListingForm vehicle={mockVehicle} isPremium={true} />);
    
    // Explicitly cast mock for function assertion safety
    expect(suggestStartingBid).toHaveBeenCalled();
    expect(await screen.findByDisplayValue('5500')).toBeInTheDocument();
  });

  it('shows locked message for AI suggestion for non-premium users', () => {
    render(<AuctionListingForm vehicle={mockVehicle} isPremium={false} />);
    expect(suggestStartingBid).not.toHaveBeenCalled();
    expect(screen.getByText(/upgrade to unlock AI suggestions/i)).toBeInTheDocument();
  });

  it('enables template save for premium users', () => {
    render(<AuctionListingForm vehicle={mockVehicle} isPremium={true} />);
    const btn = screen.getByText('Save as Template');
    expect(btn).not.toBeDisabled();
  });

  it('disables template save for non-premium users', () => {
    render(<AuctionListingForm vehicle={mockVehicle} isPremium={false} />);
    const btn = screen.getByText('Save as Template');
    expect(btn).toBeDisabled();
  });

  it('shows scheduling field and restricts it based on isPremium', () => {
    render(<AuctionListingForm vehicle={mockVehicle} isPremium={false} />);
    const input = screen.getByLabelText(/Schedule Listing/i);
    expect(input).toBeDisabled();
    expect(screen.getByText(/upgrade to enable scheduling/i)).toBeInTheDocument();
  });
});
```

### File: AuctionHistoryTracker.tsx
```tsx
// File: AuctionHistoryTracker.tsx
// Path: frontend/src/components/auction/core/AuctionHistoryTracker.tsx
// Purpose: Show auction bid history, premium insights like heatmaps, blockchain logs, seller badges
// Author: Rivers Auction Team
// Date: May 12, 2025
// 👑 Cod2 Crown Certified

import React from 'react';
import logger from '@/utils/logger';
import HeatmapChart from '@/components/common/HeatmapChart';
import BlockchainSnapshotViewer from '@/components/common/BlockchainSnapshotViewer';
import SellerBadgePanel from '@/components/auction/SellerBadgePanel';

// --- Type Definitions (re-defined or derived from external components) ---
interface BidRecord {
    time: string;
    amount: number;
}
// Note: Using 'any' for nested component types where definitions are complex or external, 
// unless strict definition is provided above. We use the simplified definitions based on component interfaces.
interface AuctionHistoryTrackerProps {
    bidHistory: BidRecord[];
    heatmapData: any[]; // Matches HeatmapEntry[] from HeatmapChart.tsx
    snapshot: Record<string, number>; // Matches BlockchainSnapshot from BlockchainSnapshotViewer.tsx
    sellerStats: { winRate: number; bidVelocity: number; engagementScore: number; }; // Matches SellerStats from SellerBadgePanel.tsx
    isPremium: boolean;
}
// --- End Type Definitions ---

const AuctionHistoryTracker: React.FC<AuctionHistoryTrackerProps> = ({ 
    bidHistory, 
    heatmapData, 
    snapshot, 
    sellerStats, 
    isPremium 
}) => {
  try {
    return (
      <div className="p-4 border bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-4">Auction History Tracker</h2>

        <section className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Basic Bid History</h3>
          <ul className="text-sm space-y-1">
            {bidHistory.map((bid, idx) => (
              <li key={idx} className="text-gray-700">
                <span className="font-mono">{bid.time}</span>: ${bid.amount}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-4">
          <HeatmapChart data={heatmapData} isPremium={isPremium} />
        </section>

        <section className="mb-4">
          <BlockchainSnapshotViewer snapshot={snapshot} isPremium={isPremium} />
        </section>

        <section className="mb-4">
          <SellerBadgePanel sellerStats={sellerStats} isPremium={isPremium} />
        </section>
      </div>
    );
  } catch (error) {
    logger.error('AuctionHistoryTracker render error:', error as Error);
    return <div className="text-red-600">Error displaying auction history</div>;
  }
};

export default AuctionHistoryTracker;
```

### File: AuctionHistoryTracker.test.tsx
```tsx
// File: AuctionHistoryTracker.test.tsx
// Path: frontend/src/tests/auction/core/AuctionHistoryTracker.test.tsx
// Purpose: Validate AuctionHistoryTracker with premium and non-premium scenarios
// Author: Rivers Auction Team
// Date: May 12, 2025
// 👑 Cod2 Crown Certified

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AuctionHistoryTracker from '@/components/auction/core/AuctionHistoryTracker';

// Mock subcomponents, defining their expected props
jest.mock('@/components/common/HeatmapChart', () => ({ 
    __esModule: true, 
    default: ({ isPremium }: { isPremium: boolean }) => <div>{isPremium ? 'HeatmapChart' : 'Upgrade Heatmap'}</div> 
}));
jest.mock('@/components/common/BlockchainSnapshotViewer', () => ({ 
    __esModule: true, 
    default: ({ isPremium }: { isPremium: boolean }) => <div>{isPremium ? 'BlockchainSnapshotViewer' : 'Upgrade Blockchain'}</div> 
}));
jest.mock('@/components/auction/SellerBadgePanel', () => ({ 
    __esModule: true, 
    default: ({ isPremium }: { isPremium: boolean }) => <div>{isPremium ? 'SellerBadgePanel' : 'Upgrade Badges'}</div> 
}));

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
```