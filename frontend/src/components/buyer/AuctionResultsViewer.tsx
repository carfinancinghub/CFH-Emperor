// @ai-generated via ai-orchestrator
This conversion utilizes TypeScript interfaces to define the component's props, replaces `prop-types`, and adheres to idiomatic TSX structure.

### `AuctionResultsViewer.tsx`

/**
 * File: AuctionResultsViewer.tsx
 * Path: frontend/src/components/buyer/AuctionResultsViewer.tsx
 * Purpose: Display auction results with real-time chat integration
 * Author: SG
 * Date: April 28, 2025
 */

import React, { useState } from 'react';

// Assuming these aliases and components exist and accept appropriate props.
// We should define types for external components if possible, but for this exercise,
// we treat them as correctly typed modules.
import PremiumFeature from '@components/common/PremiumFeature';
import CollaborationChat from '@components/chat/CollaborationChat';

// Define the shape of the component's properties
interface AuctionResultsViewerProps {
  auctionId: string;
  buyerId: string;
  isPremium: boolean;
}

// Note: The 'logger' import was removed as it was unused in the provided JS code.

const AuctionResultsViewer: React.FC<AuctionResultsViewerProps> = ({ 
    auctionId, 
    buyerId, 
    isPremium 
}) => {
  // useState infers the type as boolean, so explicit typing is not needed here.
  const [isChatOpen, setChatOpen] = useState(false);

  return (
    <div
      className="bg-white shadow-lg rounded-lg p-6 max-w-3xl mx-auto animate-fade-in"
      aria-labelledby="auction-results-title"
    >
      <h2 id="auction-results-title" className="text-2xl font-bold text-gray-800 mb-4">
        Auction Results
      </h2>

      {/* Auction results placeholder */}
      <div className="mb-6">
        <p className="text-gray-600">Auction ID: {auctionId}</p>
        {/* Additional results rendering logic here */}
      </div>

      {/* Chat button */}
      <PremiumFeature feature="collaborationChat" isPremium={isPremium}>
        <button
          onClick={() => setChatOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          aria-label="Open chat with provider"
        >
          Chat with Provider
        </button>
      </PremiumFeature>

      {/* Chat modal */}
      {isChatOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center animate-fade-in"
          role="dialog"
          aria-labelledby="chat-modal-title"
        >
          <div className="bg-white p-6 rounded-lg max-w-lg w-full">
            <h3 id="chat-modal-title" className="text-lg font-semibold text-gray-800 mb-4">
              Chat with Provider
            </h3>
            <CollaborationChat
              // Props are correctly passed and implicitly typed based on AuctionResultsViewerProps
              userId={buyerId} 
              auctionId={auctionId}
              isPremium={isPremium}
              role="buyer"
            />
            <button
              onClick={() => setChatOpen(false)}
              className="mt-4 bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
              aria-label="Close chat"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Removed AuctionResultsViewer.propTypes as TypeScript handles prop validation via the interface.

export default AuctionResultsViewer;