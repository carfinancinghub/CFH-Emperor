export type RoyaltyEventType =
  | "FUNDING_COMPLETED"
  | "ESCROW_RELEASED"
  | "MARKETPLACE_DEAL_CLOSED";

export type RoyaltyPayoutStatus = "PENDING" | "APPROVED" | "PAID" | "FAILED";

export interface RoyaltyEvent {
  id: string;
  type: RoyaltyEventType;
  dealId: string;
  createdAtISO: string;

  // Key SG Man note: Funding completion triggers royalty event for marketplace domain
  source: "finance" | "escrow" | "marketplace";
}

export interface RoyaltyPayoutLine {
  id: string;
  eventId: string;
  beneficiaryUserId: string;
  amountCents: number;
  currency: "USD";
  status: RoyaltyPayoutStatus;
  createdAtISO: string;
}
