import React, { useEffect, useState } from "react";
import { getRoyaltyEvents, RoyaltyDealCloseEvent } from "@/services/royalty/RoyaltyApi";

export default function RoyaltyDashboard(): JSX.Element {
  const [events, setEvents] = useState<RoyaltyDealCloseEvent[]>([]);

  useEffect(() => {
    const refresh = () => setEvents(getRoyaltyEvents());
    refresh();
    const t = window.setInterval(refresh, 1000);
    return () => window.clearInterval(t);
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ marginBottom: 12 }}>Royalty Dashboard (Mock v1)</h2>

      {events.length === 0 ? (
        <div>No royalty events yet. Close a deal in Marketplace to generate one.</div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {events.map((e, idx) => (
            <div
              key={`${e.dealId}-${idx}`}
              style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}
            >
              <div><b>Deal</b>: {e.dealId}</div>
              <div><b>Listing</b>: {e.listingId}</div>
              <div><b>Seller</b>: {e.sellerId}</div>
              <div><b>Buyer</b>: {e.buyerId}</div>
              <div><b>Accepted Bid</b>: {e.acceptedBidId}</div>
              <div><b>Amount</b>: {e.amount} {e.currency}</div>
              <div><b>Closed</b>: {e.closedAt}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
