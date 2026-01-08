export type RoyaltyDealClosedEvent = {
  eventType: 'ROYALTY_DEAL_CLOSED';
  eventId: string;
  occurredAt: string;
  deal: {
    dealId: string;
    listingId: string;
    sellerId: string;
    buyerId: string;
    acceptedBidId: string;
    amount: number;
    currency: string;
  };
  source: { sourceSystem: 'marketplace'; sourceVersion: 'v1' };
};

export type RoyaltyTriggerResult = { ok: boolean; message?: string };

export async function triggerDealClosedRoyalty(
  payload: RoyaltyDealClosedEvent
): Promise<RoyaltyTriggerResult> {
  // v1 seam: backend endpoint may not exist yet; keep stable contract
  try {
    const res = await fetch('/api/royalty/events/deal-closed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return { ok: false, message: `HTTP ${res.status}` };
    return { ok: true };
  } catch (e: any) {
    return { ok: false, message: e?.message ?? 'unknown error' };
  }
}
