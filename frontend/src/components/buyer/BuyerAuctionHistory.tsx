// @ai-generated via ai-orchestrator
This conversion utilizes TypeScript interfaces for prop and data definitions, replaces `prop-types`, and adds minimal explicit types to state management while preserving the component's original logic and structure.

### `BuyerAuctionHistory.tsx`

```tsx
// File: BuyerAuctionHistory.tsx
// Path: C:\CFH\frontend\src\components\buyer\BuyerAuctionHistory.tsx
// Purpose: Display buyer’s auction history with SEO metadata
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/api/auction

import React, { useState, useEffect } from 'react';
// Assuming use of a modern helmet library for SEO management
import { Helmet } from 'react-helmet-async'; 
import logger from '@utils/logger';
import { getAuctionHistory } from '@services/api/auction'; // Note: Requires definition of getAuctionHistory type elsewhere

// --- Type Definitions ---

/** Defines the structure of a single auction item */
interface AuctionItem {
  id: string | number;
  title: string;
  date: string; // Formatted date string
  finalBid: number | string; // Currency value
  status: string;
  // Add other necessary properties as defined by the backend API
}

/** Defines the props required by the BuyerAuctionHistory component */
interface BuyerAuctionHistoryProps {
  userId: string;
}

// --- Component Definition ---

const BuyerAuctionHistory: React.FC<BuyerAuctionHistoryProps> = ({ userId }) => {
  // State Initialization with explicit types
  const [auctions, setAuctions] = useState<AuctionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Assuming getAuctionHistory returns Promise<AuctionItem[]>
        const data = await getAuctionHistory(userId);
        setAuctions(data);
        logger.info(`[BuyerAuctionHistory] Fetched auction history for userId: ${userId}`);
      } catch (err) {
        // Standardized error handling for TS catch blocks
        const errorMessage = (err as Error).message;
        
        logger.error(`[BuyerAuctionHistory] Failed to fetch auction history for userId ${userId}: ${errorMessage}`, err);
        setError('Failed to load auction history. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, [userId]);

  // SEO Metadata (SG Man requirement)
  // TypeScript infers the complex JSON structure correctly based on AuctionItem usage
  const seoMetadata = {
    title: "Your Auction History - Rivers Auction Platform",
    description: "View your past vehicle auctions and bidding history on the Rivers Auction Platform.",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": auctions.map((auction, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Auction",
          "name": auction.title,
          "description": `Auction on ${auction.date} with final bid ${auction.finalBid}`,
        }
      }))
    }
  };

  if (isLoading) return <div className="p-4 text-center text-gray-500" aria-live="polite">Loading auction history...</div>;
  if (error) return <div className="p-4 text-center text-red-600 bg-red-100 border border-red-300 rounded-md" role="alert">{error}</div>;
  if (!auctions.length) return <div className="p-4 text-center text-gray-500">No auction history available.</div>;

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 max-w-2xl mx-auto my-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Your Auction History</h2>
      {/* SEO Metadata */}
      <Helmet>
        <title>{seoMetadata.title}</title>
        <meta name="description" content={seoMetadata.description} />
        {/* Note: JSON-LD script content must be correctly serialized and inserted */}
        <script type="application/ld+json">
          {JSON.stringify(seoMetadata.jsonLd)}
        </script>
      </Helmet>
      <ul className="space-y-4">
        {auctions.map((auction) => (
          <li key={auction.id} className="border-b pb-4">
            <h3 className="text-lg font-medium text-gray-700">{auction.title}</h3>
            <p className="text-sm text-gray-600">Date: {auction.date}</p>
            <p className="text-sm text-gray-600">Final Bid: ${auction.finalBid}</p>
            <p className="text-sm text-gray-600">Status: {auction.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BuyerAuctionHistory;
```