// @ai-generated via ai-orchestrator
This component is migrated to TSX, using an interface for props definition and providing explicit types for state variables and event handlers. The runtime dependency on `PropTypes` has been removed in favor of static type checking.

```tsx
// 👑 Crown Certified Component — BuyerBidModal.tsx
// Path: frontend/src/components/buyer/BuyerBidModal.tsx
// Purpose: AI-driven bidding modal for buyers with premium insights and submission controls
// Author: Rivers Auction Team — May 18, 2025
// Cod2 Crown Certified

import React, { useState, useEffect, ChangeEvent } from 'react';
// Removed PropTypes import as types now handle static validation

// Assuming these paths resolve correctly in the project configuration
import PredictionEngine from '@services/ai/PredictionEngine'; 
import logger from '@utils/logger';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@components/common/Dialog';
import Button from '@components/common/Button';

// --- Type Definitions ---

/** Assumed structure of the recommendation API response */
interface RecommendationResponse {
  suggestedBid?: number;
  history?: number[];
}

interface BuyerBidModalProps {
  auctionId: string;
  isOpen: boolean;
  onClose: () => void;
  /** Callback executed on successful bid submission with the numerical amount */
  onSubmit: (amount: number) => void;
  isPremium: boolean;
}

const BuyerBidModal: React.FC<BuyerBidModalProps> = ({
  auctionId,
  isOpen,
  onClose,
  onSubmit,
  isPremium,
}) => {
  // State initialization with minimal explicit types (inferred types for initial values are often sufficient,
  // but explicit types are added here for clarity regarding null/union types).
  const [bidAmount, setBidAmount] = useState<string>('');
  const [suggestedBid, setSuggestedBid] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [history, setHistory] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isPremium && isOpen) {
      fetchBidSuggestion();
    }
  }, [auctionId, isPremium, isOpen]);

  const fetchBidSuggestion = async () => {
    try {
      setLoading(true);
      // Assuming PredictionEngine is configured to return the RecommendationResponse type
      const response: RecommendationResponse = await PredictionEngine.getRecommendation({ auctionId });
      
      setSuggestedBid(response?.suggestedBid ?? null);
      setHistory(response?.history || []);

    } catch (err) {
      // TS best practice: handle 'unknown' error type
      logger.error('Failed to fetch bid suggestion', err);
      setError('Unable to retrieve AI suggestion.');
    } finally {
      setLoading(false);
    }
  };

  const handleBidChange = (e: ChangeEvent<HTMLInputElement>) => {
    setBidAmount(e.target.value);
  };

  const handleSubmit = () => {
    setError(null); 
    if (!bidAmount) {
      return setError('Please enter a valid bid.');
    }
    
    // Convert string input to number before submitting
    onSubmit(Number(bidAmount));
    
    // Reset state and close modal
    setBidAmount('');
    onClose();
  };

  // Optional: Display loading indicator for AI suggestion fetching
  if (loading) {
    // Return early or integrate into Dialog content
    // For minimal change, we just let the Dialog render while loading state is active
  }

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <DialogTitle>🚗 Place Your Bid</DialogTitle>
      <DialogContent>
        <input
          type="number"
          placeholder="Enter your bid amount"
          className="w-full p-2 border rounded"
          value={bidAmount}
          onChange={handleBidChange}
        />
        
        {isPremium && suggestedBid !== null && (
          <div className="mt-2 text-green-600">
            🤖 AI Suggests: <strong>${suggestedBid.toLocaleString()}</strong>
          </div>
        )}
        
        {isPremium && history.length > 0 && (
          <div className="mt-4 text-sm text-gray-500">
            <h4 className="font-semibold">📜 Bid History (AI)</h4>
            <ul className="list-disc pl-5">
              {history.map((h, idx) => (
                // Use a proper key derivation if history items are complex objects; using index for simple array elements.
                <li key={idx}>${h.toLocaleString()}</li>
              ))}
            </ul>
          </div>
        )}
        
        {error && <p className="mt-2 text-red-500">{error}</p>}
      </DialogContent>
      <DialogActions>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          Submit Bid
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BuyerBidModal;
```