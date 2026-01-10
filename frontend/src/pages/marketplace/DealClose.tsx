import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { DealClosePanel } from '@/components/marketplace/deal/DealClosePanel';

export default function DealClose() {
  const { dealId } = useParams();

  // v1 mock props
  const listingId = dealId ?? 'L-100';

  return (
    <div className="p-6">
      <Link className="text-blue-600 underline" to="/marketplace">Back</Link>
      <h1 className="text-2xl font-bold mt-3 mb-4">Deal Close</h1>

      <DealClosePanel
        dealId={dealId ?? 'D-1'}
        listingId={listingId}
        sellerId="S-1"
        buyerId="B-1"
        acceptedBidId="BID-1"
        amount={13900}
        currency="USD"
      />
    </div>
  );
}
