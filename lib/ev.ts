import type { EvInput, EvResult } from "./types";

export function calculateEv(input: EvInput): EvResult {
  const winRate = input.winRate / 100;
  const dealInRate = input.dealInRate / 100;

  const winComponent = winRate * input.expectedScore;
  const loseComponent = dealInRate * input.opponentScore;
  const rankComponent = input.rankAdjustment;

  const pushEv = winComponent - loseComponent + rankComponent;
  const foldEv = 0;

  return {
    pushEv: Math.round(pushEv),
    foldEv,
    decision: pushEv > 0 ? "push" : "fold",
    winComponent: Math.round(winComponent),
    loseComponent: Math.round(loseComponent),
    rankComponent,
  };
}
