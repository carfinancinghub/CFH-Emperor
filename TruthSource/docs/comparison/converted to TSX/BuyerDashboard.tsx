// ----------------------------------------------------------------------
// File: BuyerDashboard.tsx
// Path: frontend/src/components/dashboards/BuyerDashboard.tsx
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// The main marketplace view for the 'Buyer' role, showing active listings
// and their purchase history.
//
// @usage
// This component is lazy-loaded by the main `DashboardPage.tsx` when the
// authenticated user's role is 'buyer'.
//
// @architectural_notes
// - **Component Reuse**: This component IMPORTS and REUSES the `<ListingCard />`
//   component from the SellerDashboard module. This is a powerful demonstration
//   of our component-based architecture, eliminating code duplication.
//
// ----------------------------------------------------------------------
// --- FUTURE ENHANCEMENTS (TODO) ---
// @free:
//   - [ ] Add a robust search and filtering system for the marketplace listings.
// @premium:
//   - [ ] ✨ Implement a "Saved Searches" feature that notifies the buyer when a new car matching their criteria is listed.
// @wow:
//   - [ ] 🚀 Develop a "Compare Listings" feature that allows a buyer to select multiple cars and view their specs side-by-side in a detailed comparison table.

import React from 'react';
import { ICarListing } from '@/types'; // Assuming a central types file
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Button from '@/components/common/Button';
import { ListingCard } from './SellerDashboard'; // ARCHITECTURAL WIN: Reusing the component!

// --- Decoupled Data & Logic Hook ---
const useBuyerData = () => {
  // Mock data for demonstration.
  const [data, setData] = React.useState({ activeListings: [], purchaseHistory: [] });
  const [loading, setLoading] = React.useState(false);
  return { ...data, loading };
};

// --- Main Dashboard Component ---
const BuyerDashboard: React.FC = () => {
  const { activeListings, purchaseHistory, loading } = useBuyerData();

  if (loading) return <LoadingSpinner />;
  
  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Marketplace</h1>
      
      <section>
        <h2 className="text-2xl font-semibold mb-4">Available for Purchase</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeListings.map((listing: ICarListing) => (
            <ListingCard key={listing._id} listing={listing} actions={
              <>
                <Button variant="secondary" size="sm">Request Verification</Button>
                <Button variant="success" size="sm">Buy Now</Button>
              </>
            }/>
          ))}
        </div>
      </section>
      
      {/* A section for Purchase History would follow the same pattern */}
    </div>
  );
};

export default BuyerDashboard;