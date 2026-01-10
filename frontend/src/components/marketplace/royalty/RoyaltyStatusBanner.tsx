import React from 'react';

export function RoyaltyStatusBanner(props: { ok?: boolean; message?: string }) {
  const { ok, message } = props;
  if (ok === undefined) return null;

  return (
    <div className={`p-3 rounded border ${ok ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}`}>
      <div className="font-semibold">Royalty Trigger</div>
      <div className="text-sm">{ok ? 'Success' : `Failed${message ? `: ${message}` : ''}`}</div>
    </div>
  );
}
