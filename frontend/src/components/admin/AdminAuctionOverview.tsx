import React from "react";

export interface AdminAuctionOverviewProps {
  totalAuctions: number;
  activeAuctions: number;
  pendingPayouts: number;
  onOpenAuction?: () => void;
}

export const AdminAuctionOverview: React.FC<AdminAuctionOverviewProps> = ({
  totalAuctions,
  activeAuctions,
  pendingPayouts,
  onOpenAuction,
}) => {
  return (
    <section className="cfh-card">
      <header className="cfh-card-header">
        <h2>Admin Auction Overview</h2>
      </header>
      <div className="cfh-card-body cfh-grid cfh-grid-cols-3 cfh-gap-4">
        <div>
          <div className="cfh-label">Total auctions</div>
          <div className="cfh-value">{totalAuctions}</div>
        </div>
        <div>
          <div className="cfh-label">Active auctions</div>
          <div className="cfh-value">{activeAuctions}</div>
        </div>
        <div>
          <div className="cfh-label">Pending payouts</div>
          <div className="cfh-value">${pendingPayouts.toLocaleString()}</div>
        </div>
      </div>
      {onOpenAuction && (
        <footer className="cfh-card-footer">
          <button className="cfh-btn cfh-btn-primary" onClick={onOpenAuction}>
            Open New Auction
          </button>
        </footer>
      )}
    </section>
  );
};
