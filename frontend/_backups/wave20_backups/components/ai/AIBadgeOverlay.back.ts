// @ai-generated via ai-orchestrator
The component is converted to TSX. I have defined explicit types for the props and state, removed `PropTypes`, and typed the async operation return values based on their usage.

// File: AIBadgeOverlay.tsx
// Path: frontend/src/components/ai/AIBadgeOverlay.tsx
// Purpose: Display AI-driven badge overlays for user achievements.
// Author: Rivers Auction Team
// Date: May 15, 2025
// 👑 Cod2 Crown Certified

import React, { useEffect, useState, FC, CSSProperties } from 'react';
import Badge from '@components/common/Badge';
import { fetchUserBadgeStats } from '@services/ai/BadgeService';
import { getPremiumBadgeAnimation } from '@utils/animation';
import logger from '@utils/logger';

/**
 * Functions Summary:
 * - fetchUserBadgeStats(userId): Fetch badge stats from AI service (premium only)
 * - getPremiumBadgeAnimation(): Returns style object with glow/pulse effects
 * Inputs:
 * - userId (string, required): The user whose badge to display
 * - isPremium (boolean, required): Gating for animated badge features
 * Outputs: JSX.Element with static or animated badge
 * Dependencies: React, Badge, BadgeService, animation utils, logger
 */

// --- Type Definitions ---

interface AIBadgeOverlayProps {
  userId: string;
  isPremium: boolean;
}

/** Defines the expected structure returned by the badge service */
interface FetchedBadgeStats {
  overlayTitle: string;
  details: string | null;
}

// --- Component ---

const AIBadgeOverlay: FC<AIBadgeOverlayProps> = ({ userId, isPremium }) => {
  // State types inferred from initial values, explicitly set where required
  const [badgeTitle, setBadgeTitle] = useState('Top Bidder');
  const [badgeDetails, setBadgeDetails] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isPremium) return;

    const loadBadgeStats = async () => {
      try {
        // The service returns the stats object or undefined/null on non-fatal failure
        const stats: FetchedBadgeStats | undefined = await fetchUserBadgeStats(userId);
        
        if (stats && stats.overlayTitle) {
          setBadgeTitle(stats.overlayTitle);
          setBadgeDetails(stats.details);
        }
      } catch (err) {
        // Use 'as Error' for safe logging of potentially unknown error types
        logger.error('Failed to load badge stats:', err as Error);
        setError('Unable to load badge details.');
      }
    };

    loadBadgeStats();
  }, [userId, isPremium]);

  // Type the animation styles as standard React CSS properties
  const animationStyles: CSSProperties = isPremium
    ? getPremiumBadgeAnimation()
    : {};

  return (
    <div className="relative inline-block" style={animationStyles}>
      {/* Assuming Badge component expects a 'title' string prop */}
      <Badge title={badgeTitle} />
      {isPremium && badgeDetails && (
        <div className="text-xs text-gray-600 mt-1">{badgeDetails}</div>
      )}
      {error && (
        <div className="text-xs text-red-600 mt-1">{error}</div>
      )}
    </div>
  );
};

// PropTypes validation is replaced by TypeScript interfaces
export default AIBadgeOverlay;