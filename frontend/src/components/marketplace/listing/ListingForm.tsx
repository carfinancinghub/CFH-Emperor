import React from 'react';

export type ListingFormValue = {
  title: string;
  description: string;
  price?: number;
};

export function ListingForm(props: {
  value: ListingFormValue;
  onChange: (next: ListingFormValue) => void;
  onSubmit: () => void;
}) {
  const { value, onChange, onSubmit } = props;
  return (
    <div className="p-4 border rounded bg-white">
      <h2 className="text-lg font-semibold mb-3">Listing</h2>

      <label className="block text-sm font-medium">Title</label>
      <input
        className="w-full border rounded px-3 py-2 mt-1 mb-3"
        value={value.title}
        onChange={(e) => onChange({ ...value, title: e.target.value })}
      />

      <label className="block text-sm font-medium">Description</label>
      <textarea
        className="w-full border rounded px-3 py-2 mt-1 mb-3"
        value={value.description}
        onChange={(e) => onChange({ ...value, description: e.target.value })}
      />

      <label className="block text-sm font-medium">Price</label>
      <input
        className="w-full border rounded px-3 py-2 mt-1 mb-4"
        type="number"
        value={value.price ?? ''}
        onChange={(e) => onChange({ ...value, price: e.target.value ? Number(e.target.value) : undefined })}
      />

      <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={onSubmit}>
        Save
      </button>
    </div>
  );
}
