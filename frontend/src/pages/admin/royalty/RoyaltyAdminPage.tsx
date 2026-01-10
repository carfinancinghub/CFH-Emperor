import React from "react";
import RoyaltyAdminDashboard from "../../../components/admin/royalty/RoyaltyAdminDashboard";

export function RoyaltyAdminPage(): JSX.Element {
  return (
    <div className="p-4">
      <div className="text-xl font-semibold mb-4">Royalty Admin</div>
      <RoyaltyAdminDashboard />
    </div>
  );
}

export default RoyaltyAdminPage;
