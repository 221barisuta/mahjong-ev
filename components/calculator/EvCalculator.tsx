"use client";

import { useState } from "react";
import type { EvInput } from "@/lib/types";
import { calculateEv } from "@/lib/ev";
import InputPanel from "./InputPanel";
import ResultPanel from "./ResultPanel";
import BreakdownPanel from "./BreakdownPanel";

const DEFAULT_INPUT: EvInput = {
  winRate: 33,
  expectedScore: 5200,
  opponentScore: 5200,
  dealInRate: 14.5,
  rankAdjustment: 0,
};

export default function EvCalculator() {
  const [input, setInput] = useState<EvInput>(DEFAULT_INPUT);
  const result = calculateEv(input);

  return (
    <div className="space-y-4">
      <ResultPanel result={result} />
      <BreakdownPanel input={input} result={result} />
      <InputPanel input={input} onChange={setInput} />
    </div>
  );
}
