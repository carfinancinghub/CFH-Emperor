import React from "react";

export interface LiveDashboardHealthWidgetProps {
  apiHealthy: boolean;
  queueDepth: number;
  failedJobsLastHour: number;
  lastUpdated: string;
}

export const LiveDashboardHealthWidget: React.FC<LiveDashboardHealthWidgetProps> = ({
  apiHealthy,
  queueDepth,
  failedJobsLastHour,
  lastUpdated,
}) => {
  return (
    <section className="cfh-card">
      <header className="cfh-card-header cfh-flex cfh-justify-between cfh-items-center">
        <h2>System Health</h2>
        <span className="cfh-badge">{apiHealthy ? "Healthy" : "Degraded"}</span>
      </header>
      <div className="cfh-card-body cfh-grid cfh-grid-cols-2 cfh-gap-4">
        <div>
          <div className="cfh-label">Queue depth</div>
          <div className="cfh-value">{queueDepth}</div>
        </div>
        <div>
          <div className="cfh-label">Failed jobs (last hour)</div>
          <div className="cfh-value">{failedJobsLastHour}</div>
        </div>
      </div>
      <footer className="cfh-card-footer">
        <span className="cfh-meta">Last updated: {lastUpdated}</span>
      </footer>
    </section>
  );
};
