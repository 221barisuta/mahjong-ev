"use client";

import type { EvInput } from "@/lib/types";
import type { WaitCount, RemainingTurns } from "@/lib/types";
import {
  WIN_RATE_TABLE,
  SCORE_PRESETS,
  OPPONENT_SCORE_PRESETS,
  DEAL_IN_CATEGORIES,
  RANK_ADJUSTMENT_TABLE,
} from "@/lib/constants";

interface InputPanelProps {
  input: EvInput;
  onChange: (input: EvInput) => void;
}

function PresetButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
        active
          ? "bg-zinc-900 text-white"
          : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
      }`}
    >
      {label}
    </button>
  );
}

export default function InputPanel({ input, onChange }: InputPanelProps) {
  const update = (patch: Partial<EvInput>) => {
    onChange({ ...input, ...patch });
  };

  return (
    <div className="space-y-5">
      {/* 和了率 */}
      <div>
        <label className="block text-sm font-semibold text-zinc-800 mb-1">
          和了率: {input.winRate}%
        </label>
        <input
          type="range"
          min={0}
          max={60}
          step={0.5}
          value={input.winRate}
          onChange={(e) => update({ winRate: Number(e.target.value) })}
          className="w-full accent-zinc-800"
        />
        <div className="mt-2">
          <p className="text-xs text-zinc-500 mb-1">待ち枚数×巡目から自動入力:</p>
          <div className="grid grid-cols-4 gap-1">
            {([8, 6, 4, 2] as WaitCount[]).map((wait) =>
              ([12, 9, 6, 3] as RemainingTurns[]).map((turn) => (
                <PresetButton
                  key={`${wait}-${turn}`}
                  label={`${wait}枚${turn}巡`}
                  active={input.winRate === WIN_RATE_TABLE[wait][turn]}
                  onClick={() =>
                    update({ winRate: WIN_RATE_TABLE[wait][turn] })
                  }
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* 期待打点 */}
      <div>
        <label className="block text-sm font-semibold text-zinc-800 mb-1">
          期待打点: {input.expectedScore.toLocaleString()}点
        </label>
        <input
          type="number"
          value={input.expectedScore}
          onChange={(e) => update({ expectedScore: Number(e.target.value) })}
          className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm"
          min={0}
          step={100}
        />
        <div className="flex flex-wrap gap-1.5 mt-2">
          {SCORE_PRESETS.map((score) => (
            <PresetButton
              key={score}
              label={score.toLocaleString()}
              active={input.expectedScore === score}
              onClick={() => update({ expectedScore: score })}
            />
          ))}
        </div>
      </div>

      {/* 相手の打点 */}
      <div>
        <label className="block text-sm font-semibold text-zinc-800 mb-1">
          相手の打点(放銃点): {input.opponentScore.toLocaleString()}点
        </label>
        <input
          type="number"
          value={input.opponentScore}
          onChange={(e) => update({ opponentScore: Number(e.target.value) })}
          className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm"
          min={0}
          step={100}
        />
        <div className="flex flex-wrap gap-1.5 mt-2">
          {OPPONENT_SCORE_PRESETS.map((score) => (
            <PresetButton
              key={score}
              label={score.toLocaleString()}
              active={input.opponentScore === score}
              onClick={() => update({ opponentScore: score })}
            />
          ))}
        </div>
      </div>

      {/* 放銃率 */}
      <div>
        <label className="block text-sm font-semibold text-zinc-800 mb-1">
          放銃率: {input.dealInRate}%
        </label>
        <input
          type="range"
          min={0}
          max={25}
          step={0.5}
          value={input.dealInRate}
          onChange={(e) => update({ dealInRate: Number(e.target.value) })}
          className="w-full accent-zinc-800"
        />
        <div className="flex flex-wrap gap-1.5 mt-2">
          {DEAL_IN_CATEGORIES.map((cat) => (
            <PresetButton
              key={cat.key}
              label={`${cat.label} ${cat.range}`}
              active={input.dealInRate === cat.rate}
              onClick={() => update({ dealInRate: cat.rate })}
            />
          ))}
        </div>
      </div>

      {/* 順位補正 */}
      <div>
        <label className="block text-sm font-semibold text-zinc-800 mb-1">
          順位補正: {input.rankAdjustment > 0 ? "+" : ""}
          {input.rankAdjustment.toLocaleString()}点
        </label>
        <select
          value={input.rankAdjustment}
          onChange={(e) =>
            update({ rankAdjustment: Number(e.target.value) })
          }
          className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm"
        >
          {RANK_ADJUSTMENT_TABLE.map((r) => (
            <option key={r.key} value={r.adjustment}>
              {r.label} ({r.adjustment > 0 ? "+" : ""}
              {r.adjustment.toLocaleString()})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
