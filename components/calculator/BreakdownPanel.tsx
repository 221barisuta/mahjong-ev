import type { EvInput, EvResult } from "@/lib/types";

interface BreakdownPanelProps {
  input: EvInput;
  result: EvResult;
}

export default function BreakdownPanel({ input, result }: BreakdownPanelProps) {
  return (
    <div className="bg-zinc-50 rounded-xl p-4 text-sm space-y-2">
      <h3 className="font-semibold text-zinc-700">計算内訳</h3>
      <div className="space-y-1 font-mono text-xs">
        <div className="flex justify-between">
          <span className="text-zinc-500">
            和了率 × 期待打点 = {input.winRate}% × {input.expectedScore.toLocaleString()}
          </span>
          <span className="text-emerald-700 font-semibold">
            +{result.winComponent.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-500">
            放銃率 × 放銃点 = {input.dealInRate}% × {input.opponentScore.toLocaleString()}
          </span>
          <span className="text-red-700 font-semibold">
            -{result.loseComponent.toLocaleString()}
          </span>
        </div>
        {result.rankComponent !== 0 && (
          <div className="flex justify-between">
            <span className="text-zinc-500">順位補正</span>
            <span
              className={
                result.rankComponent > 0
                  ? "text-emerald-700 font-semibold"
                  : "text-red-700 font-semibold"
              }
            >
              {result.rankComponent > 0 ? "+" : ""}
              {result.rankComponent.toLocaleString()}
            </span>
          </div>
        )}
        <hr className="border-zinc-300" />
        <div className="flex justify-between font-bold text-base">
          <span>押しEV</span>
          <span
            className={
              result.pushEv > 0 ? "text-emerald-700" : "text-red-700"
            }
          >
            {result.pushEv > 0 ? "+" : ""}
            {result.pushEv.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
