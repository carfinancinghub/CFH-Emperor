// =====================================================
// Royalty API (Mock v1)
// =====================================================

export type RoyaltyDealCloseEvent = {
  dealId: string;
  listingId: string;
  sellerId: string;
  buyerId: string;
  acceptedBidId: string;
  amount: number;
  currency: string;
  closedAt: string;
};

// -----------------------------------------------------
// Trigger royalty on deal close (mock seam)
// -----------------------------------------------------
export async function triggerRoyaltyOnDealClose(
  evt: Omit<RoyaltyDealCloseEvent, "closedAt">
): Promise<{ ok: true; event: RoyaltyDealCloseEvent }> {
  const event: RoyaltyDealCloseEvent = {
    ...evt,
    closedAt: new Date().toISOString(),
  };

  // Visible proof during dev
  // eslint-disable-next-line no-console
  console.log("[ROYALTY_TRIGGER] deal_close", event);

  return Promise.resolve({ ok: true, event });
}

// -----------------------------------------------------
// Local Royalty Event Store (mock v1)
// -----------------------------------------------------
const LS_KEY = "cfh_royalty_events";

export function recordRoyaltyEvent(evt: RoyaltyDealCloseEvent) {
  try {
    const raw = localStorage.getItem(LS_KEY);
    const list: RoyaltyDealCloseEvent[] = raw ? JSON.parse(raw) : [];
    list.unshift(evt);
    localStorage.setItem(LS_KEY, JSON.stringify(list.slice(0, 200)));
  } catch {
    // no-op (storage may be unavailable)
  }
}

export function getRoyaltyEvents(): RoyaltyDealCloseEvent[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

