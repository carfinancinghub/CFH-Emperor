import React, { ComponentProps } from "react";
import { createRoot, Root } from "react-dom/client";
import Confetti from "react-confetti";

let activeRoot: Root | null = null;

export function triggerConfetti(
  milestone: "minor" | "major" = "minor",
  elementId = "confetti-container"
) {
  if (typeof document === "undefined") return;
  const target = document.getElementById(elementId);
  if (!target) return;

  if (activeRoot) activeRoot.unmount();

  activeRoot = createRoot(target);
  const width = typeof window !== "undefined" ? window.innerWidth : 0;
  const height = typeof window !== "undefined" ? window.innerHeight : 0;
  const props =
    milestone === "minor"
      ? { numberOfPieces: 60, recycle: false, gravity: 0.3 }
      : { numberOfPieces: 200, recycle: false, gravity: 0.25 };

  activeRoot.render(<Confetti width={width} height={height} {...props} />);
}

export function cleanupConfetti() {
  if (activeRoot) {
    activeRoot.unmount();
    activeRoot = null;
  }
}

export function RewardConfetti(
  props: Partial<ComponentProps<typeof Confetti>>
) {
  const width = typeof window !== "undefined" ? window.innerWidth : 0;
  const height = typeof window !== "undefined" ? window.innerHeight : 0;
  return <Confetti width={width} height={height} {...props} />;
}
