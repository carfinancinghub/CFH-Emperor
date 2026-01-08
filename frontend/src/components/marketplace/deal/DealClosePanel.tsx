import React, { useMemo, useState } from 'react';
import { triggerDealClosedRoyalty, RoyaltyDealClosedEvent } from '@/services/royalty/RoyaltyApi';

export function DealClosePanel(props: {
  dealId: string;
  listingId: string;
  sellerId: string;
  buyerId: string;
  acceptedBidId: string;
  amount: number;
  currency: string;
}) {
  const [status, setStatus] = useState<{ ok: boolean; message?: string } | null>(null);
  const payload: RoyaltyDealClosedEvent = useMemo(() => ({
    eventType: 'ROYALTY_DEAL_CLOSED',
    eventId: crypto?.randomUUID ? crypto.randomUUID() : `evt_${Date.now()}`,
    occurredAt: new Date().toISOString(),
    deal: {
      dealId: props.dealId,
      listingId: props.listingId,
      sellerId: props.sellerId,
      buyerId: props.buyerId,
      acceptedBidId: props.acceptedBidId,
      amount: props.amount,
      currency: props.currency,
    },
    source: { sourceSystem: 'marketplace', sourceVersion: 'v1' },
  }), [props]);

  const onTrigger = async () => {
    const res = await triggerDealClosedRoyalty(payload);
    setStatus(res);
  };

  return (
    <div className="p-4 border rounded bg-white">
      <h3 className="font-semibold mb-2">Deal Close</h3>
      <p className="text-sm mb-3">Closing this deal will trigger the royalty event.</p>

      <button className="px-4 py-2 rounded bg-purple-600 text-white" onClick={onTrigger}>
        Close Deal + Trigger Royalty
      </button>

      {status && (
        <div className="mt-3 text-sm">
          Status: {status.ok ? 'OK' : 'FAILED'} {status.message ? `(${status.message})` : ''}
        </div>
      )}
    </div>
  );
}
