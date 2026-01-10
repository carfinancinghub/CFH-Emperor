import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getListing, Listing } from '@/services/marketplace/MarketplaceApi';
import { BidForm } from '@/components/marketplace/bids/BidForm';

export default function ListingDetail() {
  const { listingId } = useParams();
  const [item, setItem] = useState<Listing | null>(null);

  useEffect(() => {
    if (listingId) getListing(listingId).then(setItem);
  }, [listingId]);

  if (!item) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <Link className="text-blue-600 underline" to="/marketplace">Back</Link>
      <h1 className="text-2xl font-bold mt-3 mb-2">{item.title}</h1>
      <p className="mb-4">{item.description}</p>

      <BidForm onPlaceBid={(amt) => alert(`Bid placed: $${amt}`)} />

      <div className="mt-6">
        <Link className="text-purple-700 underline" to={`/marketplace/deal/${item.id}/close`}>
          Go to Deal Close (mock)
        </Link>
      </div>
    </div>
  );
}
