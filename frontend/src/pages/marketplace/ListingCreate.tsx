import React, { useState } from 'react';
import { ListingForm, ListingFormValue } from '@/components/marketplace/listing/ListingForm';
import { Link } from 'react-router-dom';

export default function ListingCreate() {
  const [value, setValue] = useState<ListingFormValue>({ title: '', description: '', price: undefined });

  return (
    <div className="p-6">
      <Link className="text-blue-600 underline" to="/marketplace">Back</Link>
      <h1 className="text-2xl font-bold mt-3 mb-4">Create Listing</h1>
      <ListingForm value={value} onChange={setValue} onSubmit={() => alert('Listing saved (mock)')} />
    </div>
  );
}
