import React from "react";

export function RoyaltyBanner(): JSX.Element {
  return (
    <div className="border rounded-lg p-3 bg-white">
      <div className="font-semibold">Royalty</div>
      <div className="text-sm text-gray-600">
        Revenue share is tracked on funding completion and surfaced in the admin dashboard.
      </div>
    </div>
  );
}

export default RoyaltyBanner;
