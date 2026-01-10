// PremiumFeature.tsx

import React from "react";
import PremiumFeature from "./PremiumFeature";

export type PremiumGateProps = React.ComponentProps<typeof PremiumFeature>;

/**
 * PremiumGate
 * Compatibility wrapper so legacy imports can use:
 *   import { PremiumGate } from "@components/common";
 */
export function PremiumGate(props: PremiumGateProps) {
  return <PremiumFeature {...props} />;
}

export default PremiumGate;
