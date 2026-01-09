import React, { useEffect, useState } from "react";
import { getRoyaltyEvents, RoyaltyDealCloseEvent } from "@/services/royalty/RoyaltyApi";

export default function FinanceOverview(): JSX.Element {
  const [latest, setLatest] = useState<RoyaltyDealCloseEvent | null>(null);

  useEffect(() => {
    const refresh = () => {
      const events = getRoyaltyEvents();
      setLatest(events.length > 0 ? events[0] : null);
    };
    refresh();
    const t = window.setInterval(refresh, 1000);
    return () => window.clearInterval(t);
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ marginBottom: 12 }}>Finance Overview (Mock v1)</h2>

      {!latest ? (
        <div>No deal context yet. Close a deal in Marketplace first.</div>
      ) : (
        <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
          <div style={{ marginBottom: 8 }}>
            <b>Deal Context</b>
          </div>
          <div><b>Deal</b>: {latest.dealId}</div>
          <div><b>Listing</b>: {latest.listingId}</div>
          <div><b>Amount</b>: {latest.amount} {latest.currency}</div>
          <div><b>Closed</b>: {latest.closedAt}</div>

          <div style={{ marginTop: 12 }}>
            <b>Prequal / Underwriting</b>
          </div>
          <div>Status: <b>APPROVED (MOCK)</b></div>
          <div>Reason: Deal context received from Marketplace close</div>
        </div>
      )}
    </div>
  );
}
