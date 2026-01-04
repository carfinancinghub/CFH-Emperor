import React from "react";

export interface LoadingSpinnerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  label = "Loading…",
  className = "",
  ...rest
}) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`cfh-loading-spinner ${className}`.trim()}
      {...rest}
    >
      <span
        className="cfh-loading-spinner__icon"
        aria-hidden="true"
      >
        ⏳
      </span>
      <span className="cfh-loading-spinner__label sr-only">
        {label}
      </span>
    </div>
  );
};

export default LoadingSpinner;
