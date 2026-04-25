"use client";

import { useState } from "react";
import type { ReviewRound } from "@/lib/mahjong/reviewer";
import MomentDetail from "./MomentDetail";

export default function ReviewRoundCard({ round }: { round: ReviewRound }) {
  const [open, setOpen] = useState(false);

  const warnCount = round.moments.filter((m) => m.severity === "warn").length;
  const badCount = round.moments.filter((m) => m.severity === "bad").length;
  const hasIssue = warnCount > 0 || badCount > 0;

  return (
    <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full px-3 py-2.5 flex items-center justify-between hover:bg-zinc-50"
      >
        <div className="text-left">
          <p className="text-sm font-bold">{round.name}</p>
          <p className="text-xs text-zinc-500">
            {round.outcome} ・ 検討 {round.moments.length} 打
            {hasIssue && (
              <>
                {" "}
                ・{" "}
                {badCount > 0 && (
                  <span className="text-red-600 font-medium">悪手 {badCount}</span>
                )}
                {badCount > 0 && warnCount > 0 && " / "}
                {warnCount > 0 && (
                  <span className="text-amber-600 font-medium">注意 {warnCount}</span>
                )}
              </>
            )}
          </p>
        </div>
        <span className="text-zinc-400 text-sm">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="border-t border-zinc-200 p-3 space-y-3 bg-zinc-50">
          {round.moments.length === 0 ? (
            <p className="text-xs text-zinc-500">
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
