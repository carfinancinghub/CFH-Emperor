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

export async function triggerRoyaltyOnDealClose(
  evt: Omit<RoyaltyDealCloseEvent, "closedAt">
): Promise<{ ok: true; event: RoyaltyDealCloseEvent }> {
  // Mock seam: in real integration this becomes a POST to backend royalty endpoint.
  const event: RoyaltyDealCloseEvent = {
    ...evt,
    closedAt: new Date().toISOString(),
  };

  // Keep visible proof during dev without breaking build.
  // eslint-disable-next-line no-console
  console.log("[ROYALTY_TRIGGER] deal_close", event);

  return Promise.resolve({ ok: true, event });
}
