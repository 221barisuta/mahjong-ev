"use client";

import { useState } from "react";
import type { ReviewRound } from "@/lib/mahjong/reviewer";
import MomentDetail from "./MomentDetail";

export default function ReviewRoundCard({ round }: { round: ReviewRound }) {
  const [open, setOpen] = useState(false);

  const warnCount = round.moments.filter((m) => m.severity === "warn").length;
  const badCount = round.moments.filter((m) => m.severity === "bad").length;

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "var(--c-card)",
        border: "1px solid var(--c-border)",
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-[var(--c-bg)]/50"
      >
        <div>
          <p className="text-sm font-bold">{round.name}</p>
          <p
            className="text-xs mt-0.5"
            style={{ color: "var(--c-text-faint)" }}
          >
            {round.outcome} ・ 検討 {round.moments.length} 打
          </p>
        </div>
        <div className="flex items-center gap-2">
          {badCount > 0 && (
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: "var(--c-fold)", color: "#fff" }}
            >
              悪手 {badCount}
            </span>
          )}
          {warnCount > 0 && (
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: "var(--c-warn)", color: "#fff" }}
            >
              注意 {warnCount}
            </span>
          )}
          <span
            className="text-sm"
            style={{ color: "var(--c-text-faint)" }}
          >
            {open ? "▲" : "▼"}
          </span>
        </div>
      </button>

      {open && (
        <div
          className="p-3 space-y-3"
          style={{
            background: "var(--c-bg)",
            borderTop: "1px solid var(--c-border)",
          }}
        >
          {round.moments.length === 0 ? (
            <p
              className="text-xs"
              style={{ color: "var(--c-text-faint)" }}
            >
              検討対象の打牌なし（鳴き発生・配牌時など）
            </p>
          ) : (
            round.moments.map((m, i) => <MomentDetail key={i} moment={m} />)
          )}
        </div>
      )}
    </div>
  );
}
