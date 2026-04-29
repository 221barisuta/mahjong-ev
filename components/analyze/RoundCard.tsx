"use client";

import { useState } from "react";
import type { RoundAnalysis, PushFoldMoment } from "@/lib/tenhou/analyzer";
import type { EvInput } from "@/lib/types";
import { calculateEv } from "@/lib/ev";
import { Tile, TileList } from "./TileDisplay";
import BreakdownPanel from "@/components/calculator/BreakdownPanel";

const formatSigned = (n: number) =>
  (n > 0 ? "+" : n < 0 ? "−" : "±") + Math.abs(n).toLocaleString("ja-JP");

function MomentCard({
  moment,
  index,
}: {
  moment: PushFoldMoment;
  index: number;
}) {
  const [input, setInput] = useState<EvInput>(moment.evInput);
  const [expanded, setExpanded] = useState(false);
  const result = calculateEv(input);
  const isPush = result.decision === "push";

  const dangerColor =
    moment.combinedDangerRate === 0
      ? { bg: "var(--c-bg)", fg: "var(--c-text-dim)" }
      : moment.combinedDangerRate <= 5
        ? { bg: "#eaf3fa", fg: "#1c4f8a" }
        : moment.combinedDangerRate <= 10
          ? { bg: "#fdf3dc", fg: "#a87618" }
          : { bg: "var(--c-fold-bg)", fg: "var(--c-fold)" };

  return (
    <div
      className="rounded-lg p-3 space-y-2"
      style={{
        background: "var(--c-card)",
        border: "1px solid var(--c-border)",
      }}
    >
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 text-xs">
          <span style={{ color: "var(--c-text-faint)" }}>#{index + 1}</span>
          <span style={{ color: "var(--c-text-dim)" }}>
            {moment.turnNumber}巡目
          </span>
          <span style={{ color: "var(--c-text-faint)" }}>
            (残り{moment.remainingTurns}巡)
          </span>
          <span className="flex items-center gap-1">
            <span style={{ color: "var(--c-text-dim)" }}>打:</span>
            <Tile id={moment.discardTile} size="md" />
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="text-[11px] font-bold px-2 py-0.5 rounded font-num tabular-nums"
            style={{ background: dangerColor.bg, color: dangerColor.fg }}
          >
            {moment.riichiPlayers[0]?.danger.label}{" "}
            {moment.combinedDangerRate}%
          </span>
          <span
            className="text-[11px] font-bold px-2 py-0.5 rounded-full font-num tabular-nums"
            style={{
              background: isPush ? "var(--c-push)" : "var(--c-fold)",
              color: "#fff",
            }}
          >
            {isPush ? "押" : "降"} {formatSigned(result.pushEv)}
          </span>
        </div>
      </div>

      <div className="text-xs" style={{ color: "var(--c-text-faint)" }}>
        vs{" "}
        {moment.riichiPlayers
          .map((r) => `${r.name}${r.isDealer ? "(親)" : ""}`)
          .join(", ")}{" "}
        のリーチ
      </div>

      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="text-xs underline"
        style={{ color: "var(--c-text-dim)" }}
      >
        {expanded ? "閉じる" : "詳細・調整"}
      </button>

      {expanded && (
        <div className="space-y-3 pt-1">
          <div>
            <p
              className="text-[10px] mb-1 font-semibold tracking-[0.1em]"
              style={{ color: "var(--c-text-faint)" }}
            >
              手牌
            </p>
            <TileList tiles={moment.hand} highlightTile={moment.discardTile} />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <NumberInput
              label="和了率 (%)"
              value={input.winRate}
              onChange={(v) => setInput({ ...input, winRate: v })}
              max={60}
            />
            <NumberInput
              label="期待打点"
              value={input.expectedScore}
              onChange={(v) => setInput({ ...input, expectedScore: v })}
              step={100}
            />
            <NumberInput
              label="放銃率 (%)"
              value={input.dealInRate}
              onChange={(v) => setInput({ ...input, dealInRate: v })}
              max={25}
              step={0.5}
            />
            <NumberInput
              label="相手打点"
              value={input.opponentScore}
              onChange={(v) => setInput({ ...input, opponentScore: v })}
              step={100}
            />
          </div>

          <BreakdownPanel input={input} result={result} />
        </div>
      )}
    </div>
  );
}

function NumberInput({
  label,
  value,
  onChange,
  max,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  max?: number;
  step?: number;
}) {
  return (
    <div>
      <label
        className="block text-[10px] mb-0.5 font-semibold tracking-[0.1em]"
        style={{ color: "var(--c-text-faint)" }}
      >
        {label}
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded px-2 py-1 font-num tabular-nums text-sm outline-none"
        style={{
          background: "var(--c-bg)",
          border: "1px solid var(--c-border)",
          color: "var(--c-text)",
        }}
        min={0}
        max={max}
        step={step}
      />
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
  void players;
  const [open, setOpen] = useState(round.moments.length > 0);
  const hasMoments = round.moments.length > 0;

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: hasMoments ? "var(--c-card)" : "var(--c-card)",
        border: `1px solid ${hasMoments ? "var(--c-border-hi)" : "var(--c-border)"}`,
      }}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[var(--c-bg)]/50"
      >
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="font-bold text-sm">{round.name}</span>
          <span
            className="text-xs font-num tabular-nums"
            style={{ color: "var(--c-text-faint)" }}
          >
            {round.scores.map((s, i) => (
              <span key={i}>
                {i > 0 && " / "}
                <span
                  style={{
                    fontWeight: i === targetPlayer ? 700 : 500,
                    color:
                      i === targetPlayer
                        ? "var(--c-text)"
                        : "var(--c-text-faint)",
                  }}
                >
                  {s.toLocaleString()}
                </span>
              </span>
            ))}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {hasMoments && (
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{
                background: "var(--c-warn)",
                color: "#fff",
              }}
            >
              {round.moments.length}判断
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
          className="px-4 pb-3 pt-1 space-y-2"
          style={{
            background: "var(--c-bg)",
            borderTop: "1px solid var(--c-border)",
          }}
        >
          <p
            className="text-xs"
            style={{ color: "var(--c-text-dim)" }}
          >
            結果: {round.outcome}
          </p>

          {hasMoments ? (
            <div className="space-y-2">
              {round.moments.map((m, i) => (
                <MomentCard key={i} moment={m} index={i} />
              ))}
            </div>
          ) : (
            <p
              className="text-xs"
              style={{ color: "var(--c-text-faint)" }}
            >
              リーチ対応の押し引き判断なし
            </p>
          )}
        </div>
      )}
    </div>
  );
}
