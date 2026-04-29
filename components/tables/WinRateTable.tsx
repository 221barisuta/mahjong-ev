import { Fragment } from "react";
import { WIN_RATE_TABLE, SHANTEN_WIN_RATES } from "@/lib/constants";
import type { WaitCount, RemainingTurns } from "@/lib/types";

const waits: WaitCount[] = [8, 6, 4, 2];
const turns: RemainingTurns[] = [12, 9, 6, 3];

export default function WinRateTable() {
  return (
    <div className="space-y-4">
      <div
        className="rounded-2xl p-5 md:p-6"
        style={{
          background: "var(--c-card)",
          border: "1px solid var(--c-border)",
        }}
      >
        <div
          className="pb-3 mb-3"
          style={{ borderBottom: "1px solid var(--c-border)" }}
        >
          <div className="text-sm font-bold">和了率早見表</div>
          <div
            className="text-xs mt-1"
            style={{ color: "var(--c-text-dim)" }}
          >
            待ち枚数 × 残り巡目
          </div>
        </div>
        <div
          className="grid gap-1.5"
          style={{ gridTemplateColumns: "auto repeat(4, 1fr)" }}
        >
          <div></div>
          {turns.map((j) => (
            <div
              key={j}
              className="text-[11px] font-semibold text-center px-1 py-1.5 tracking-[0.1em]"
              style={{ color: "var(--c-text-dim)" }}
            >
              残り{j}巡
            </div>
          ))}
          {waits.map((w) => (
            <Fragment key={`row-${w}`}>
              <div
                className="text-[11px] font-semibold text-right py-2 px-2"
                style={{ color: "var(--c-text-dim)" }}
              >
                {w}枚
              </div>
              {turns.map((j) => {
                const r = WIN_RATE_TABLE[w][j];
                const heat = `rgba(10, 135, 84, ${0.10 + (r / 100) * 1.2})`;
                return (
                  <div
                    key={`${w}-${j}`}
                    className="font-num font-bold text-center text-sm py-3 rounded tabular-nums"
                    style={{ background: heat, color: "var(--c-ink)" }}
                  >
                    {r}%
                  </div>
                );
              })}
            </Fragment>
          ))}
        </div>
      </div>

      <div
        className="rounded-2xl p-5 md:p-6"
        style={{
          background: "var(--c-card)",
          border: "1px solid var(--c-border)",
        }}
      >
        <div
          className="pb-3 mb-2"
          style={{ borderBottom: "1px solid var(--c-border)" }}
        >
          <div className="text-sm font-bold">1シャンテン時の和了率</div>
          <div
            className="text-xs mt-1"
            style={{ color: "var(--c-text-dim)" }}
          >
            残り10巡目安
          </div>
        </div>
        <div className="flex flex-col">
          {SHANTEN_WIN_RATES.map((s) => (
            <div
              key={s.label}
              className="grid items-center gap-3 py-2.5 px-1"
              style={{
                gridTemplateColumns: "1fr auto",
                borderBottom: "1px solid var(--c-border)",
              }}
            >
              <div className="text-xs md:text-sm">{s.label}</div>
              <div
                className="font-num font-bold tabular-nums"
                style={{ color: "var(--c-push)" }}
              >
                約{s.rate}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
