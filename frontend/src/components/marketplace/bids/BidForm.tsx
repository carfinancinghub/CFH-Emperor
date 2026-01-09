import React, { useState } from 'react';

export function BidForm(props: { onPlaceBid: (amount: number) => void }) {
  const { onPlaceBid } = props;
  const [amount, setAmount] = useState<number>(0);

  return (
    <div className="p-4 border rounded bg-white">
      <h3 className="font-semibold mb-2">Place a Bid</h3>
      <input
        className="w-full border rounded px-3 py-2 mb-3"
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />
      <button className="px-4 py-2 rounded bg-green-600 text-white" onClick={() => onPlaceBid(amount)}>
        Submit Bid
      </button>
    </div>
  );
}
