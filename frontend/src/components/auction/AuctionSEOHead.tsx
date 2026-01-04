// @ai-generated via ai-orchestrator
// This file has been converted to TSX, applying idiomatic TypeScript typing, especially for React props, DOM manipulation, and error handling.

// ### `AuctionSEOHead.tsx`

/**
 * File: AuctionSEOHead.tsx
 * Path: frontend/src/components/auction/AuctionSEOHead.tsx
 * Purpose: Dynamic meta tags for SEO on auction pages
 * Author: Cod2 (05082217)
 * Date: May 08, 2025
 * Cod2 Crown Certified
 */

// --- Dependencies ---
import React, { useEffect, FC } from 'react';
// Assuming logger is an external utility typed correctly, or we rely on implicit type
import logger from '@utils/logger';

// --- Type Definitions ---

/** Defines the minimal structure required from the auction object for SEO generation. */
interface Auction {
  vehicle: string;
  category: string;
  // Allows for other properties present in the auction object
  [key: string]: unknown; 
}

/** Defines the props structure for the AuctionSEOHead component. */
interface AuctionSEOHeadProps {
  auction: Auction | null | undefined;
}

// --- Component Definition ---

/**
 * AuctionSEOHead Component
 * Purpose: Injects SEO and Open Graph tags dynamically based on auction content
 * Props:
 *   - auction: Object containing auction metadata (e.g., vehicle, category)
 * Returns: Null (modifies document.head directly)
 */
const AuctionSEOHead: FC<AuctionSEOHeadProps> = ({ auction }) => {

  /**
   * logError
   * Purpose: Logs runtime errors related to SEO injection
   */
  const logError = (error: Error): void => {
    // Ensure we handle the error object which is assumed to have a message property
    logger.error(`AuctionSEOHead Error: ${error.message}`);
  };

  /**
   * generateSEOKeywords
   * Purpose: Creates SEO keyword string based on auction category
   */
  const generateSEOKeywords = (auctionCategory: string): string => {
    return `auction, ${auctionCategory}, vehicle bidding, equity financing, Rivers Auction`;
  };

  /**
   * updateDynamicTitle
   * Purpose: Updates the page title based on auction details
   */
  const updateDynamicTitle = (currentAuction: Auction): void => {
    try {
      document.title = `${currentAuction.vehicle} Auction | Rivers Auction Platform`;
    } catch (error) {
      // TypeScript requires explicit handling of 'unknown' error type in catch blocks
      logError(error as Error); 
    }
  };

  // --- Lifecycle Hook with modular meta tag injection ---
  useEffect(() => {
    // Exit if auction data is not yet available
    if (!auction) return;

    // Use HTMLMetaElement[] to store references to the created tags for cleanup
    const tags: HTMLMetaElement[] = [];

    /**
     * Helper function to create, set attributes, and append meta tags.
     */
    const createAndAppendMeta = (
      nameOrProp: string,
      content: string,
      isProperty: boolean = false
    ): void => {
      try {
        const tag = document.createElement('meta');
        
        if (isProperty) {
          tag.setAttribute('property', nameOrProp);
        } else {
          tag.name = nameOrProp;
        }
        
        tag.content = content;
        document.head.appendChild(tag);
        tags.push(tag);
        
      } catch (error) {
        logError(error as Error);
      }
    };

    // --- Inject Meta Tags ---
    createAndAppendMeta('keywords', generateSEOKeywords(auction.category));
    createAndAppendMeta(
      'description',
      `Bid on ${auction.vehicle} via equity financing. No FICA checks required unless opted in.`
    );
    createAndAppendMeta('og:title', `${auction.vehicle} Equity Auction`, true);
    createAndAppendMeta(
      'og:description',
      `Join the Rivers Auction for ${auction.vehicle} – 100% equity-financed bidding.`,
      true
    );
    createAndAppendMeta('og:type', 'website', true);

    updateDynamicTitle(auction);

    // --- Cleanup Function ---
    return () => {
      tags.forEach((tag) => {
        try {
          // Check if the element is still attached to the head before attempting removal
          if (document.head.contains(tag)) {
             document.head.removeChild(tag);
          }
        } catch (error) {
          logError(error as Error);
        }
      });
    };
  }, [auction]); // Dependency on auction ensures re-run when auction data changes

  // Component does not render DOM elements itself
  return null;
};

export default AuctionSEOHead;