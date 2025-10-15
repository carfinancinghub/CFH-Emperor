// File: SEOHelper.ts
// Path: backend/services/seo/SEOHelper.ts
// Purpose: Generate dynamic, rich SEO metadata and structured data for auctions.
// Author: Mini, System Architect
// Date: August 10, 2025
// 👑 Cod1 Crown Certified — Dynamic, Configurable, and Rich SEO Generation.

// TODO:
// @free:
//   - [ ] Expand the 'Vehicle' structured data schema to include more properties like 'mileageFromOdometer', 'vehicleEngine', etc., for even richer search results.
// @premium:
//   - [ ] ✨ Add a 'generateSitemapEntry' function that creates XML entries for auction pages to be included in a dynamic sitemap.
// @wow:
//   - [ ] 🚀 Integrate a generative AI model (e.g., GPT-4) to write unique, compelling, and SEO-optimized descriptions for each auction automatically, based on the vehicle's specs and history.

import logger from '@/utils/logger';

// --- Type Definitions ---
interface IAuction {
  id: string;
  title: string;
  currentBid: number;
  images: string[];
  vehicleDetails: {
    make: string;
    model: string;
    year: number;
    vin: string;
  };
}

interface IMetadata {
  title: string;
  metaDescription: string;
  openGraph: {
    title: string;
    description: string;
    image: string;
    url: string;
  };
}

// --- Service Module ---
const SEOHelper = {
  /**
   * Generates standard and Open Graph metadata for an auction page.
   */
  generateMetadata(auction: IAuction): IMetadata {
    try {
      const { id, title, currentBid, images, vehicleDetails } = auction;
      const appUrl = process.env.APP_URL || 'https://riversauction.com'; // ARCHITECTURAL UPGRADE: Use environment variable

      const metaTitle = `${vehicleDetails.year} ${vehicleDetails.make} ${vehicleDetails.model} - Auction on Rivers Platform`;
      // ARCHITECTURAL UPGRADE: Dynamic, keyword-rich description
      const metaDescription = `Bid on this ${vehicleDetails.year} ${vehicleDetails.make} ${vehicleDetails.model}. Current bid is $${currentBid.toLocaleString()}. VIN: ${vehicleDetails.vin}. Join the immersive Rivers Auction experience!`;

      const metadata: IMetadata = {
        title: metaTitle,
        metaDescription: metaDescription,
        openGraph: {
          title: metaTitle,
          description: metaDescription,
          image: images[0] || `${appUrl}/default-image.jpg`,
          url: `${appUrl}/auctions/${id}`,
        },
      };

      logger.info(`[SEOHelper] Generated metadata for auctionId: ${id}`);
      return metadata;
    } catch (err) {
      const error = err as Error;
      logger.error(`[SEOHelper] Failed to generate metadata for auctionId ${auction.id}: ${error.message}`, error);
      throw error;
    }
  },

  /**
   * Generates Schema.org structured data (JSON-LD) for an auction.
   */
  generateStructuredData(auction: IAuction): object {
    try {
      const { title, currentBid, images, vehicleDetails } = auction;

      // ARCHITECTURAL UPGRADE: Uses the more specific 'Vehicle' schema
      const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Vehicle',
        name: title,
        description: `Online auction for a ${vehicleDetails.year} ${vehicleDetails.make} ${vehicleDetails.model}.`,
        image: images[0] || `${process.env.APP_URL}/default-image.jpg`,
        vehicleIdentificationNumber: vehicleDetails.vin,
        brand: {
          '@type': 'Brand',
          name: vehicleDetails.make,
        },
        model: vehicleDetails.model,
        productionDate: vehicleDetails.year.toString(),
        offers: {
          '@type': 'Offer',
          price: currentBid,
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
        },
      };

      logger.info(`[SEOHelper] Generated structured data for auctionId: ${auction.id}`);
      return structuredData;
    } catch (err) {
      const error = err as Error;
      logger.error(`[SEOHelper] Failed to generate structured data for auctionId ${auction.id}: ${error.message}`, error);
      throw error;
    }
  },
};

export default SEOHelper;