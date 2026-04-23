"use client";

import { useState } from "react";
import type { RoundAnalysis, PushFoldMoment } from "@/lib/tenhou/analyzer";
import type { EvInput } from "@/lib/types";
import { calculateEv } from "@/lib/ev";
import { tileName } from "@/lib/tenhou/tiles";
import { Tile, TileList } from "./TileDisplay";
import BreakdownPanel from "@/components/calculator/BreakdownPanel";

function MomentCard({
  moment,
  players,
  index,
}: {
  moment: PushFoldMoment;
  players: string[];
  index: number;
}) {
  const [input, setInput] = useState<EvInput>(moment.evInput);
  const [expanded, setExpanded] = useState(false);
  const result = calculateEv(input);
  const isPush = result.decision === "push";

  return (
    <div className="border border-zinc-200 rounded-lg p-3 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">#{index + 1}</span>
          <span className="text-xs text-zinc-500">
            {moment.turnNumber}巡目
          </span>
          <span className="text-xs text-zinc-500">
            (残り約{moment.remainingTurns}巡)
          </span>
          <span className="text-xs font-medium">
            打: <Tile id={moment.discardTile} size="md" />
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded ${
              moment.combinedDangerRate === 0
                ? "bg-zinc-100 text-zinc-600"
                : moment.combinedDangerRate <= 5
                  ? "bg-blue-100 text-blue-700"
                  : moment.combinedDangerRate <= 10
                    ? "bg-amber-100 text-amber-700"
                    : "bg-red-100 text-red-700"
            }`}
          >
            {moment.riichiPlayers[0]?.danger.label} {moment.combinedDangerRate}%
          </span>
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              isPush
                ? "bg-emerald-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {isPush ? "押し" : "降り"}{" "}
            {result.pushEv > 0 ? "+" : ""}
            {result.pushEv.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Riichi info */}
      <div className="text-xs text-zinc-500">
        vs{" "}
        {moment.riichiPlayers
          .map(
            (r) =>
              `${r.name}${r.isDealer ? "(親)" : ""}`,
          )
          .join(", ")}
        のリーチ
      </div>

      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="text-xs text-zinc-500 underline"
      >
        {expanded ? "閉じる" : "詳細・調整"}
      </button>

      {expanded && (
        <div className="space-y-3 pt-1">
          {/* Hand */}
          <div>
            <p className="text-xs text-zinc-500 mb-1">手牌:</p>
            <TileList tiles={moment.hand} />
          </div>

          {/* Adjustable inputs */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="block text-zinc-500 mb-0.5">和了率 (%)</label>
              <input
                type="number"
                value={input.winRate}
                onChange={(e) =>
                  setInput({ ...input, winRate: Number(e.target.value) })
                }
                className="w-full border rounded px-2 py-1"
                min={0}
                max={60}
                step={1}
              />
            </div>
            <div>
              <label className="block text-zinc-500 mb-0.5">期待打点</label>
              <input
                type="number"
                value={input.expectedScore}
                onChange={(e) =>
                  setInput({
                    ...input,
                    expectedScore: Number(e.target.value),
                  })
                }
                className="w-full border rounded px-2 py-1"
                min={0}
                step={100}
              />
            </div>
            <div>
              <label className="block text-zinc-500 mb-0.5">放銃率 (%)</label>
              <input
                type="number"
                value={input.dealInRate}
                onChange={(e) =>
                  setInput({ ...input, dealInRate: Number(e.target.value) })
                }
                className="w-full border rounded px-2 py-1"
                min={0}
                max={25}
                step={0.5}
              />
            </div>
            <div>
              <label className="block text-zinc-500 mb-0.5">相手打点</label>
              <input
                type="number"
                value={input.opponentScore}
                onChange={(e) =>
                  setInput({
                    ...input,
                    opponentScore: Number(e.target.value),
                  })
                }
                className="w-full border rounded px-2 py-1"
                min={0}
                step={100}
              />
            </div>
          </div>

          <BreakdownPanel input={input} result={result} />
        </div>
      )}
    </div>
  );
}

export default function RoundCard({
  round,
  players,
  targetPlayer,
}: {
  round: RoundAnalysis;
  players: string[];
  targetPlayer: number;
}) {
  const [open, setOpen] = useState(round.moments.length > 0);
  const hasMoments = round.moments.length > 0;

  return (
    <div
      className={`rounded-xl border ${
        hasMoments ? "border-amber-300 bg-amber-50/30" : "border-zinc-200 bg-white"
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <div>
          <span className="font-bold text-sm">{round.name}</span>
          <span className="ml-2 text-xs text-zinc-500">
            {round.scores.map((s, i) => (
              <span
                key={i}
                className={i === targetPlayer ? "font-bold text-zinc-800" : ""}
              >
                {i > 0 && " / "}
                {s.toLocaleString()}
              </span>
            ))}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {hasMoments && (
            <span className="text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full font-medium">
              {round.moments.length}判断
            </span>
          )}
          <span className="text-zinc-400 text-sm">{open ? "▲" : "▼"}</span>
        </div>
      </button>

      {open && (
        <div className="px-4 pb-3 space-y-2">
          <p className="text-xs text-zinc-600">結果: {round.outcome}</p>

          {hasMoments ? (
            <div className="space-y-2">
              {round.moments.map((m, i) => (
                <MomentCard
                  key={i}
                  moment={m}
                  players={players}
                  index={i}
                />
              ))}
            </div>
          ) : (
            <p className="text-xs text-zinc-400">
              リーチ対応の押し引き判断なし
            </p>
          )}
        </div>
      )}
    </div>
  );
}
