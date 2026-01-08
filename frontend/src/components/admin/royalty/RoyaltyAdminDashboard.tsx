import React, { useMemo } from "react";
import RoyaltyBanner from "../../royalty/RoyaltyBanner";
import RoyaltyLedgerTable from "../../royalty/RoyaltyLedgerTable";
import type { RoyaltyPayoutLine } from "../../royalty/types";

export function RoyaltyAdminDashboard(): JSX.Element {
  const rows: RoyaltyPayoutLine[] = useMemo(() => [], []);

  return (
    <div className="space-y-4">
      <RoyaltyBanner />
      <RoyaltyLedgerTable rows={rows} />
    </div>
  );
}

export default RoyaltyAdminDashboard;
