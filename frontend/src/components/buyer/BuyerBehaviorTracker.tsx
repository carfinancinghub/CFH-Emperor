// @ai-generated via ai-orchestrator
This file should be converted to `.tsx` (TypeScript JSX). We will define interfaces for the component props and the structure of data stored in `localStorage`.

```tsx
/**
 * BuyerBehaviorTracker.tsx
 * Path: frontend/src/components/buyer/BuyerBehaviorTracker.tsx
 * Purpose: Track buyer actions (views, searches) to feed AI suggestions with offline storage.
 * 👑 Cod2 Crown Certified
 */

import React, { useEffect } from 'react';
import axios from 'axios';
// PropTypes is replaced by TypeScript interfaces

// 1. Define the data structure for actions stored in localStorage
interface BuyerAction {
  buyerId: string;
  action: string;
  details: Record<string, any>; // Use Record<string, any> for generic object details
  timestamp: string;
}

// 2. Define component Props
interface BuyerBehaviorTrackerProps {
  buyerId: string;
  // action and details are optional when the component mounts, but required for tracking
  action?: string;
  details?: Record<string, any>;
}

const BuyerBehaviorTracker = ({ buyerId, action, details }: BuyerBehaviorTrackerProps) => {
  // Store action in localStorage and send to backend
  useEffect(() => {
    // Check if the specific action data is present before tracking
    if (!action || !details) return;

    const storeAndSendAction = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return; // Silently skip if not authenticated

        // Retrieve and type stored actions
        const storedActions: BuyerAction[] = JSON.parse(localStorage.getItem('buyerActions') || '[]');
        
        const newAction: BuyerAction = { 
          buyerId, 
          action, 
          details, 
          timestamp: new Date().toISOString() 
        };
        
        // Store immediately for offline resilience
        storedActions.push(newAction);
        localStorage.setItem('buyerActions', JSON.stringify(storedActions));

        // Send to backend
        await axios.post(
          `/api/buyer/behavior`,
          { buyerId, action, details },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // If successful, clear sent action from localStorage
        const updatedActions = storedActions.filter(
          (a) => a.timestamp !== newAction.timestamp
        );
        localStorage.setItem('buyerActions', JSON.stringify(updatedActions));
      } catch (err) {
        // Silently store action for retry later (it remains in localStorage)
        console.error('Failed to send behavior:', err);
      }
    };

    storeAndSendAction();
    
    // Dependencies include action and details to ensure tracking runs only when they change/are provided.
  }, [buyerId, action, details]);

  // Sync stored actions on mount
  useEffect(() => {
    const syncStoredActions = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Retrieve and type stored actions
        const storedActions: BuyerAction[] = JSON.parse(localStorage.getItem('buyerActions') || '[]');
        if (storedActions.length === 0) return;

        // Iterate and send each action sequentially
        for (const storedAction of storedActions) {
          await axios.post(
            `/api/buyer/behavior`,
            {
              buyerId: storedAction.buyerId,
              action: storedAction.action,
              details: storedAction.details,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        }

        // Clear synced actions only if all successful
        localStorage.setItem('buyerActions', '[]');
      } catch (err) {
        // If sync fails, the items remain in localStorage for the next attempt.
        console.error('Failed to sync stored actions:', err);
      }
    };

    syncStoredActions();
  // Runs once on mount
  }, []);

  return null; // No UI, runs in background
};

export default BuyerBehaviorTracker;
```