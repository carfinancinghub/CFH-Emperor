import React, { useState } from 'react';
import { ListingForm, ListingFormValue } from '@/components/marketplace/listing/ListingForm';
import { Link } from 'react-router-dom';

export default function ListingEdit() {
  const [value, setValue] = useState<ListingFormValue>({ title: 'Sample', description: 'Edit me', price: 100 });

  return (
    <div className="p-6">
      <Link className="text-blue-600 underline" to="/marketplace">Back</Link>
      <h1 className="text-2xl font-bold mt-3 mb-4">Edit Listing</h1>
      <ListingForm value={value} onChange={setValue} onSubmit={() => alert('Listing updated (mock)')} />
    </div>
  );
}
