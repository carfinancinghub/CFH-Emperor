// File: auctionExportUtils.ts
// Path: frontend/src/utils/auction/auctionExportUtils.ts
// Author: Cod5 (07212245, July 21, 2025, 22:45 PDT)
// Purpose: Utility for exporting auction-related data (e.g., auction records, summaries, dispute data) as CSV or PDF, supporting analytics features for free and Enterprise users

import axios from '@utils/axios';
import { logError } from '@utils/logger';
import { toast } from '@utils/react-toastify';

// === Interfaces ===
interface Auction {
  id: string;
  title: string;
  currentBid: number;
  timeRemaining: string;
}

interface SummaryData {
  totalAuctions?: number;
  totalBidValue?: number;
  trendingVehicles?: Array<{ make: string; model: string; count: number }>;
}

interface Vote {
  vote: string;
}

interface DisputeSummary {
  disputeId: string;
  voteCounts: { [vote: string]: number };
  outcome: string;
}

// === Auction Export Utilities ===
// Exports basic auction data to CSV for free users
export const exportAuctionDataAsCSV = async (auctions: Auction[]): Promise<string> => {
  try {
    if (!Array.isArray(auctions)) {
      throw new Error('Invalid auction data: must be an array');
    }

    const csvContent = [
      'ID,Title,Current Bid,Time Remaining',
      ...auctions.map(auction =>
        `${auction.id},${auction.title},${auction.currentBid.toFixed(2)},${auction.timeRemaining}`
      ),
    ].join('\n');

    const response = await axios.post('/api/export/csv', { content: csvContent });
    toast.success('Auction data exported as CSV!');
    return response.data.url; // Assumes API returns a downloadable URL
  } catch (err) {
    logError(err);
    toast.error('Failed to export auction data as CSV.');
    throw new Error('Failed to export auction data.');
  }
};

// Intended for Enterprise users; gate with PremiumFeature (feature="auctionAnalytics") at the component level
// Exports detailed auction summary to PDF for Enterprise users
export const exportAuctionSummaryAsPDF = async (auctions: Auction[], summaryData: SummaryData): Promise<string> => {
  try {
    if (!Array.isArray(auctions) || !summaryData || typeof summaryData !== 'object') {
      throw new Error('Invalid auction or summary data');
    }

    const payload = {
      auctions,
      summary: {
        totalAuctions: summaryData.totalAuctions || auctions.length,
        totalBidValue: summaryData.totalBidValue || auctions.reduce((sum, a) => sum + a.currentBid, 0),
        trendingVehicles: summaryData.trendingVehicles || [],
      },
    };

    const response = await axios.post('/api/export/pdf', payload, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    toast.success('Auction summary exported as PDF!');
    return url; // Returns a blob URL for download
  } catch (err) {
    logError(err);
    toast.error('Failed to export auction summary as PDF.');
    throw new Error('Failed to export auction summary.');
  }
};

// Intended for Enterprise users; gate with PremiumFeature (feature="auctionAnalytics") at the component level
// Exports dispute voting summary to PDF for Enterprise users
export const exportDisputeSummaryAsPDF = async (disputeId: string, votes: Vote[]): Promise<string> => {
  try {
    if (!disputeId || !Array.isArray(votes)) {
      throw new Error('Invalid dispute ID or votes data');
    }

    const voteCounts = votes.reduce((acc, v) => {
      acc[v.vote] = (acc[v.vote] || 0) + 1;
      return acc;
    }, {} as { [vote: string]: number });
    const outcome = Object.keys(voteCounts).reduce((a, b) => voteCounts[a] > voteCounts[b] ? a : b, 'undecided');

    const payload: DisputeSummary = {
      disputeId,
      voteCounts,
      outcome,
    };

    const response = await axios.post('/api/export/pdf/dispute', payload, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    toast.success('Dispute summary exported as PDF!');
    return url; // Returns a blob URL for download
  } catch (err) {
    logError(err);
    toast.error('Failed to export dispute summary as PDF.');
    throw new Error('Failed to export dispute summary.');
  }
};

// === TODOs and Suggestions ===
// - Add support for additional export formats (e.g., JSON, Excel).
// - Integrate with a reporting dashboard for visualized export previews.
// - Cache export results to reduce API calls for frequent exports.

**Functions Summary**:
- **exportAuctionDataAsCSV(auctions)**
  - **Purpose**: Exports basic auction data to CSV for free users.
  - **Inputs**: auctions (Array) - Array of auction objects with id, title, currentBid, timeRemaining.
  - **Outputs**: String - URL for the downloadable CSV file.
  - **Dependencies**: @utils/axios, @utils/logger (logError), @utils/react-toastify (toast)
- **exportAuctionSummaryAsPDF(auctions, summaryData)**
  - **Purpose**: Exports a detailed auction summary to PDF for Enterprise users.
  - **Inputs**: auctions (Array) - Array of auction objects; summaryData (Object) - Summary stats like totalAuctions, totalBidValue, trendingVehicles.
  - **Outputs**: String - URL for the downloadable PDF file.
  - **Dependencies**: @utils/axios, @utils/logger (logError), @utils/react-toastify (toast)
- **exportDisputeSummaryAsPDF(disputeId, votes)**
  - **Purpose**: Exports a dispute voting summary to PDF for Enterprise users.
  - **Inputs**: disputeId (String) - The ID of the dispute; votes (Array) - Array of vote objects with vote property.
  - **Outputs**: String - URL for the downloadable PDF file.
  - **Dependencies**: @utils/axios, @utils/logger (logError), @utils/react-toastify (toast)