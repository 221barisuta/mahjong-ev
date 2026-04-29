"use client";

import { useMemo, useState } from "react";
import { calculateEv } from "@/lib/ev";
import {
  WIN_RATE_TABLE,
  SCORE_PRESETS,
  OPPONENT_SCORE_PRESETS,
  DEAL_IN_CATEGORIES,
  RANK_ADJUSTMENT_TABLE,
} from "@/lib/constants";
import type { WaitCount, RemainingTurns } from "@/lib/types";
import Gauge from "./Gauge";

const RISK_DOT_COLORS = [
  "#86c785",
  "#a4ce5a",
  "#cdc44a",
  "#dfa033",
  "#d4623a",
  "#b6342a",
];

const formatPlain = (n: number) =>
  Math.abs(n).toLocaleString("ja-JP");
const formatSigned = (n: number) =>
  (n > 0 ? "+" : n < 0 ? "−" : "±") + Math.abs(n).toLocaleString("ja-JP");
const pct = (r: number) => `${(r * 100).toFixed(r * 100 < 10 ? 1 : 0)}%`;

export default function EvCalculator() {
  const [waitCount, setWaitCount] = useState<WaitCount>(4);
  const [junme, setJunme] = useState<RemainingTurns>(9);
  const [expectedScore, setExpectedScore] = useState<number>(5200);
  const [opponentScore, setOpponentScore] = useState<number>(5200);
  const [dealInIdx, setDealInIdx] = useState<number>(4);
  const [rankAdjustment, setRankAdjustment] = useState<number>(0);

  const winRatePct = WIN_RATE_TABLE[waitCount][junme];
  const dealInCategory = DEAL_IN_CATEGORIES[dealInIdx];
  const dealInRate = dealInCategory.rate;

  const result = useMemo(
    () =>
      calculateEv({
        winRate: winRatePct,
        expectedScore,
        opponentScore,
        dealInRate,
        rankAdjustment,
      }),
    [winRatePct, expectedScore, opponentScore, dealInRate, rankAdjustment],
  );

  const isPush = result.decision === "push";
  const meterPct = Math.min(50, (Math.abs(result.pushEv) / 5000) * 50);

  return (
    <div className="space-y-4 md:space-y-5">
      <HeroCard
        ev={result.pushEv}
        isPush={isPush}
        winRatePct={winRatePct / 100}
        winPts={expectedScore}
        winTerm={result.winComponent}
        dealInRate={dealInRate / 100}
        dealPts={opponentScore}
        dealTerm={result.loseComponent}
        rank={rankAdjustment}
        meterPct={meterPct}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-3.5">
        <CtrlCard
          wide
          label="① 和了率"
          subLabel="待ち枚数 × 残り巡目から自動算出"
          valueText={`${winRatePct}%`}
          valueColor="var(--c-push)"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-1">
            <SegmentControl
              label="待ち枚数"
              options={([8, 6, 4, 2] as WaitCount[]).map((n) => ({
                value: n,
                display: `${n}枚`,
              }))}
              active={waitCount}
              onChange={(v) => setWaitCount(v as WaitCount)}
            />
            <SegmentControl
              label="残り巡目"
              options={([12, 9, 6, 3] as RemainingTurns[]).map((n) => ({
                value: n,
                display: `${n}巡`,
              }))}
              active={junme}
              onChange={(v) => setJunme(v as RemainingTurns)}
            />
          </div>
        </CtrlCard>

        <CtrlCard
          label="② 期待打点"
          valueText={expectedScore.toLocaleString()}
          valueColor="var(--c-push)"
        >
          <SegmentControl
            options={SCORE_PRESETS.map((p) => ({
              value: p,
              display: p >= 10000 ? `${(p / 1000) | 0}k` : p.toLocaleString(),
            }))}
            active={expectedScore}
            onChange={(v) => setExpectedScore(Number(v))}
          />
        </CtrlCard>

        <CtrlCard
          label="③ 相手打点"
          valueText={opponentScore.toLocaleString()}
          valueColor="var(--c-fold)"
        >
          <SegmentControl
            tone="fold"
            options={OPPONENT_SCORE_PRESETS.map((p) => ({
              value: p,
              display: p >= 10000 ? `${(p / 1000) | 0}k` : p.toLocaleString(),
            }))}
            active={opponentScore}
            onChange={(v) => setOpponentScore(Number(v))}
          />
        </CtrlCard>

        <CtrlCard
          label="④ 切る牌の危険度"
          valueText={`${dealInRate}%`}
          valueColor="var(--c-fold)"
        >
          <ul className="flex flex-col gap-1.5">
            {DEAL_IN_CATEGORIES.map((cat, i) => {
              const active = dealInIdx === i;
              return (
                <li key={cat.key}>
                  <button
                    type="button"
                    onClick={() => setDealInIdx(i)}
                    className={`w-full grid grid-cols-[auto_1fr_auto] items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                      active
                        ? "bg-[var(--c-bg)] border border-[var(--c-border-hi)]"
                        : "border border-transparent hover:bg-[var(--c-bg)]/60"
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full inline-block"
                      style={{ background: RISK_DOT_COLORS[i] }}
                    />
                    <span className="font-semibold text-left">{cat.label}</span>
                    <span className="font-num text-xs text-[var(--c-text-dim)]">
                      {cat.rate}%
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </CtrlCard>

        <CtrlCard
          label="⑤ 順位補正"
          valueText={formatSigned(rankAdjustment)}
          valueColor={
            rankAdjustment > 0
              ? "var(--c-push)"
              : rankAdjustment < 0
                ? "var(--c-fold)"
                : "var(--c-text)"
          }
        >
          <ul className="flex flex-col gap-1">
            {RANK_ADJUSTMENT_TABLE.map((r) => {
              const active = rankAdjustment === r.adjustment;
              return (
                <li key={r.key}>
                  <button
                    type="button"
                    onClick={() => setRankAdjustment(r.adjustment)}
                    className={`w-full flex justify-between items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                      active
                        ? "bg-[var(--c-bg)] border border-[var(--c-border-hi)]"
                        : "border border-transparent hover:bg-[var(--c-bg)]/60"
                    }`}
                  >
                    <span className="text-left">{r.label}</span>
                    <span
                      className="font-num font-bold text-xs"
                      style={{
                        color:
                          r.adjustment > 0
                            ? "var(--c-push)"
                            : r.adjustment < 0
                              ? "var(--c-fold)"
                              : "var(--c-text-faint)",
                      }}
                    >
                      {r.adjustment === 0
                        ? "±0"
                        : formatSigned(r.adjustment)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </CtrlCard>
      </div>
    </div>
  );
}

function HeroCard({
  ev,
  isPush,
  winRatePct,
  winPts,
  winTerm,
  dealInRate,
  dealPts,
  dealTerm,
  rank,
  meterPct,
}: {
  ev: number;
  isPush: boolean;
  winRatePct: number;
  winPts: number;
  winTerm: number;
  dealInRate: number;
  dealPts: number;
  dealTerm: number;
  rank: number;
  meterPct: number;
}) {
  const accent = isPush ? "var(--c-push)" : "var(--c-fold)";
  const accentBg = isPush ? "var(--c-push-bg)" : "var(--c-fold-bg)";

  return (
    <div
      className="rounded-2xl p-5 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 items-center"
      style={{
        background: "var(--c-card)",
        border: "1px solid var(--c-border)",
      }}
    >
      <div className="relative w-full grid place-items-center">
        <Gauge ev={ev} push={isPush} />
        <div className="absolute text-center pointer-events-none -translate-y-2">
          <div
            className="font-glyph leading-none tracking-tighter"
            style={{
              color: accent,
              fontSize: "76px",
              fontWeight: 800,
            }}
          >
            {isPush ? "押" : "降"}
          </div>
          <div
            className="font-num font-bold mt-1"
            style={{ color: accent, fontSize: "22px" }}
          >
            {formatSigned(ev)}
          </div>
          <div
            className="text-[10px] font-semibold mt-1 tracking-[0.18em]"
            style={{ color: "var(--c-text-faint)" }}
          >
            EV vs FOLD
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3.5">
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold tracking-[0.1em] self-start"
          style={{
            background: accentBg,
            color: accent,
            border: `1px solid ${accent}33`,
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full inline-block"
            style={{ background: accent }}
          />
          {isPush ? "PUSH RECOMMENDED" : "FOLD RECOMMENDED"}
        </div>

        <h2
          className="text-xl md:text-[26px] font-bold leading-snug"
          style={{ letterSpacing: "-0.02em" }}
        >
          {isPush ? (
            <>
              押した方が{" "}
              <span style={{ color: "var(--c-push)" }}>
                {formatPlain(ev)}点
              </span>{" "}
              得
            </>
          ) : (
            <>
              降りた方が{" "}
              <span style={{ color: "var(--c-fold)" }}>
                {formatPlain(Math.abs(ev))}点
              </span>{" "}
              得
            </>
          )}
        </h2>

        <div>
          <div
            className="relative h-3 rounded-full overflow-visible"
            style={{ background: "#eee9dd" }}
          >
            <div
              className="absolute top-0 h-full rounded-full"
              style={{
                left: isPush ? "50%" : `${50 - meterPct}%`,
                width: `${meterPct}%`,
                background: accent,
              }}
            />
            <div
              className="absolute top-[-3px] h-[18px] w-[2px]"
              style={{
                left: "50%",
                background: "var(--c-ink)",
                transform: "translateX(-50%)",
              }}
            />
          </div>
          <div className="flex justify-between mt-2 text-[11px] font-semibold tracking-[0.1em]">
            <span style={{ color: "var(--c-fold)" }}>← 降り</span>
            <span style={{ color: "var(--c-text-faint)" }}>0</span>
            <span style={{ color: "var(--c-push)" }}>押し →</span>
          </div>
        </div>

        <div
          className="rounded-lg p-3 md:p-4 font-num text-[13px] leading-7"
          style={{
            background: "var(--c-bg)",
            border: "1px solid var(--c-border)",
          }}
        >
          <div>
            <span className="font-bold" style={{ color: "var(--c-push)" }}>
              +{formatPlain(winTerm)}
            </span>{" "}
            <span style={{ color: "var(--c-text-faint)" }}>
              ({pct(winRatePct)} × {winPts.toLocaleString()})
            </span>
          </div>
          <div>
            <span className="font-bold" style={{ color: "var(--c-fold)" }}>
              −{formatPlain(dealTerm)}
            </span>{" "}
            <span style={{ color: "var(--c-text-faint)" }}>
              ({pct(dealInRate)} × {dealPts.toLocaleString()})
            </span>
          </div>
          {rank !== 0 && (
            <div>
              <span
                className="font-bold"
                style={{
                  color: rank > 0 ? "var(--c-push)" : "var(--c-fold)",
                }}
              >
                {formatSigned(rank)}
              </span>{" "}
              <span style={{ color: "var(--c-text-faint)" }}>(順位補正)</span>
            </div>
          )}
          <div style={{ color: "var(--c-text-faint)" }}>━━━━━━━━━━━</div>
          <div
            className="font-bold"
            style={{ color: accent, fontSize: "16px" }}
          >
            = {formatSigned(ev)}
          </div>
        </div>
      </div>
    </div>
  );
}

function CtrlCard({
  label,
  subLabel,
  valueText,
  valueColor,
  wide,
  children,
}: {
  label: string;
  subLabel?: string;
  valueText: string;
  valueColor: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-2xl p-4 md:p-[18px] ${wide ? "md:col-span-2" : ""}`}
      style={{
        background: "var(--c-card)",
        border: "1px solid var(--c-border)",
      }}
    >
      <div className="flex justify-between items-baseline mb-3">
        <div>
          <div
            className="text-xs font-bold tracking-[0.1em]"
            style={{ color: "var(--c-text-dim)" }}
          >
            {label}
          </div>
          {subLabel && (
            <div
              className="text-[11px] mt-0.5"
              style={{ color: "var(--c-text-faint)" }}
            >
              {subLabel}
            </div>
          )}
        </div>
        <div
          className="font-num font-bold text-lg md:text-xl"
          style={{ color: valueColor }}
        >
          {valueText}
        </div>
      </div>
      {children}
    </div>
  );
}

function SegmentControl<T extends number>({
  label,
  options,
  active,
  onChange,
  tone,
}: {
  label?: string;
  options: { value: T; display: string }[];
  active: T;
  onChange: (v: T) => void;
  tone?: "push" | "fold";
}) {
  const activeBg = tone === "fold" ? "var(--c-fold)" : "var(--c-ink)";
  return (
    <div>
      {label && (
        <div
          className="text-[11px] font-semibold tracking-[0.1em] mb-1.5"
          style={{ color: "var(--c-text-faint)" }}
        >
          {label}
        </div>
      )}
      <div
        className="flex gap-0.5 p-0.5 rounded-lg"
        style={{
          background: "var(--c-bg)",
          border: "1px solid var(--c-border)",
        }}
      >
        {options.map((opt) => {
          const isActive = opt.value === active;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className="flex-1 py-2 text-center text-xs font-bold font-num rounded-md transition-colors"
              style={{
                background: isActive ? activeBg : "transparent",
                color: isActive ? "#fff" : "var(--c-text-dim)",
              }}
            >
              {opt.display}
            </button>
          );
        })}
      </div>
    </div>
  );
}
