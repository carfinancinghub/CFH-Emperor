import React from "react";
import Confetti, { Props as ConfettiProps } from "react-confetti";

type RewardProps = { confettiProps?: Partial<ConfettiProps> };

export function RewardConfetti({ confettiProps }: RewardProps) {
  const width = typeof window !== "undefined" ? window.innerWidth : 0;
  const height = typeof window !== "undefined" ? window.innerHeight : 0;
  return <Confetti width={width} height={height} {...(confettiProps ?? {})} />;
}
