import React, { ComponentProps } from "react";
import Confetti from "react-confetti";

type RewardProps = { confettiProps?: Partial<ComponentProps<typeof Confetti>> };

export function RewardConfetti({ confettiProps }: RewardProps) {
  const width = typeof window !== "undefined" ? window.innerWidth : 0;
  const height = typeof window !== "undefined" ? window.innerHeight : 0;
  return <Confetti width={width} height={height} {...(confettiProps ?? {})} />;
}
