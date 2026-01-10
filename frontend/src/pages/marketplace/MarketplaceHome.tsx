import React, { useEffect, useState } from 'react';
import { searchListings, Listing } from '@/services/marketplace/MarketplaceApi';
import { Link } from 'react-router-dom';

export default function MarketplaceHome() {
  const [q, setQ] = useState('');
  const [items, setItems] = useState<Listing[]>([]);

  useEffect(() => {
    searchListings(q).then(setItems);
  }, [q]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Marketplace</h1>

      <input
        className="w-full border rounded px-3 py-2 mb-4"
        placeholder="Search listings..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((x) => (
          <div key={x.id} className="p-4 border rounded bg-white">
            <div className="font-semibold">{x.title}</div>
            <div className="text-sm text-gray-700">{x.description}</div>
            <div className="text-sm mt-2">
              <Link className="text-blue-600 underline" to={`/marketplace/listing/${x.id}`}>
                View
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
