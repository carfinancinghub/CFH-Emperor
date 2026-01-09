import React, { useState } from "react";
import { triggerRoyaltyOnDealClose } from "@/services/royalty/RoyaltyApi";
import { emit } from "@/services/domainEvents";

export type DealClosePanelProps = {
  dealId: string;
  listingId: string;
  sellerId: string;
  buyerId: string;
  acceptedBidId: string;
  amount: number;
  currency: string;
};

export function DealClosePanel(props: DealClosePanelProps) {
  const [closing, setClosing] = useState(false);
  const [done, setDone] = useState<null | { closedAt: string }>(null);
  const [error, setError] = useState<string>("");

  const onCloseDeal = async () => {
    setClosing(true);
    setError("");
    try {
      // ✅ Deal close → royalty trigger seam (mock v1)
      const res = await triggerRoyaltyOnDealClose({
        dealId: props.dealId,
        listingId: props.listingId,
        sellerId: props.sellerId,
        buyerId: props.buyerId,
        acceptedBidId: props.acceptedBidId,
        amount: props.amount,
        currency: props.currency,
      });

      // 🔔 Cross-domain event (Marketplace → Royalty → Finance)
      emit("royalty_trigger", {
        dealId: props.dealId,
        listingId: props.listingId,
        sellerId: props.sellerId,
        buyerId: props.buyerId,
        amount: props.amount,
        currency: props.currency,
        closedAt: res.event.closedAt,
        ts: new Date().toISOString(),
      });

      emit("deal_closed", {
        dealId: props.dealId,
        listingId: props.listingId,
      });

      setDone({ closedAt: res.event.closedAt });
    } catch (e: any) {
      setError(e?.message ?? "Failed to close deal");
    } finally {
      setClosing(false);
    }
  };

  return (
    <div className="border rounded bg-white p-4">
      <div className="font-semibold mb-2">Deal Summary</div>

      <div className="text-sm text-gray-700 space-y-1">
        <div>Deal: {props.dealId}</div>
        <div>Listing: {props.listingId}</div>
        <div>Seller: {props.sellerId}</div>
        <div>Buyer: {props.buyerId}</div>
        <div>Accepted Bid: {props.acceptedBidId}</div>
        <div>
          Amount: {props.amount} {props.currency}
        </div>
      </div>

      {error && <div className="text-sm text-red-600 mt-3">{error}</div>}

      {done ? (
        <div className="mt-4 text-sm text-green-700">
          Deal closed at {done.closedAt}. Royalty trigger fired.
        </div>
      ) : (
        <button
          type="button"
          className="mt-4 px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-60"
          onClick={onCloseDeal}
          disabled={closing}
        >
          {closing ? "Closing..." : "Close Deal"}
        </button>
      )}
    </div>
  );
}
