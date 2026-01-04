import React from "react";

export interface AdminCustomWidgetDefinition {
  id: string;
  name: string;
  description?: string;
  domain: string;
  enabled: boolean;
}

export interface AdminCustomWidgetLibraryProps {
  widgets: AdminCustomWidgetDefinition[];
  onToggleEnabled?: (id: string, enabled: boolean) => void;
}

export const AdminCustomWidgetLibrary: React.FC<AdminCustomWidgetLibraryProps> = ({
  widgets,
  onToggleEnabled,
}) => {
  return (
    <section className="cfh-card">
      <header className="cfh-card-header">
        <h2>Admin Custom Widget Library</h2>
      </header>
      <ul className="cfh-list">
        {widgets.map((widget) => (
          <li key={widget.id} className="cfh-list-item cfh-flex cfh-justify-between cfh-items-center">
            <div>
              <div className="cfh-item-title">{widget.name}</div>
              {widget.description && (
                <div className="cfh-item-subtitle">{widget.description}</div>
              )}
              <div className="cfh-badge-row">
                <span className="cfh-badge">Domain: {widget.domain}</span>
              </div>
            </div>
            <div>
              {onToggleEnabled && (
                <label className="cfh-toggle">
                  <input
                    type="checkbox"
                    checked={widget.enabled}
                    onChange={(e) => onToggleEnabled(widget.id, e.target.checked)}
                  />
                  <span>{widget.enabled ? "Enabled" : "Disabled"}</span>
                </label>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};
