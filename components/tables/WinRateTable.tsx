import { WIN_RATE_TABLE, WIN_RATE_LABELS, REMAINING_TURNS_LABELS, SHANTEN_WIN_RATES } from "@/lib/constants";
import type { WaitCount, RemainingTurns } from "@/lib/types";

const waits: WaitCount[] = [8, 6, 4, 2];
const turns: RemainingTurns[] = [12, 9, 6, 3];

export default function WinRateTable() {
  return (
    <div className="space-y-4">
      <h3 className="font-bold text-zinc-800">和了率表（テンパイ時）</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-zinc-100">
              <th className="border border-zinc-300 px-2 py-1.5 text-left">待ち枚数</th>
              {turns.map((t) => (
                <th key={t} className="border border-zinc-300 px-2 py-1.5 text-center">
                  {REMAINING_TURNS_LABELS[t]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {waits.map((w) => (
              <tr key={w}>
                <td className="border border-zinc-300 px-2 py-1.5 font-medium">
                  {WIN_RATE_LABELS[w]}
                </td>
                {turns.map((t) => (
                  <td key={t} className="border border-zinc-300 px-2 py-1.5 text-center font-mono">
                    {WIN_RATE_TABLE[w][t]}%
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h4 className="font-semibold text-zinc-700 text-sm mt-4">1シャンテン時（残り10巡目安）</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-zinc-100">
              <th className="border border-zinc-300 px-2 py-1.5 text-left">状態</th>
              <th className="border border-zinc-300 px-2 py-1.5 text-center">和了率</th>
            </tr>
          </thead>
          <tbody>
            {SHANTEN_WIN_RATES.map((s) => (
              <tr key={s.label}>
                <td className="border border-zinc-300 px-2 py-1.5">{s.label}</td>
                <td className="border border-zinc-300 px-2 py-1.5 text-center font-mono">
                  約{s.rate}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
