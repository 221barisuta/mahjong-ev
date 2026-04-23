"use client";

import { useState, useEffect, useCallback } from "react";
import type { AnalysisSummary } from "@/lib/tenhou/analyzer";

export interface HistoryEntry {
  url: string;
  players: string[];
  targetPlayer: number;
  summary: AnalysisSummary;
  analyzedAt: number;
}

const STORAGE_KEY = "mahjong-ev-history";
const MAX_HISTORY = 30;

function loadHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(entries: HistoryEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, MAX_HISTORY)));
}

export function useHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const addHistory = useCallback(
    (entry: Omit<HistoryEntry, "analyzedAt">) => {
      setHistory((prev) => {
        const filtered = prev.filter((h) => h.url !== entry.url);
        const next = [{ ...entry, analyzedAt: Date.now() }, ...filtered];
        saveHistory(next);
        return next.slice(0, MAX_HISTORY);
      });
    },
    [],
  );

  const removeHistory = useCallback((url: string) => {
    setHistory((prev) => {
      const next = prev.filter((h) => h.url !== url);
      saveHistory(next);
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    saveHistory([]);
    setHistory([]);
  }, []);

  return { history, addHistory, removeHistory, clearHistory };
}

function formatDate(ts: number): string {
  const d = new Date(ts);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const h = d.getHours().toString().padStart(2, "0");
  const m = d.getMinutes().toString().padStart(2, "0");
  return `${month}/${day} ${h}:${m}`;
}

function RankBadge({ rank }: { rank: number }) {
  const colors: Record<number, string> = {
    1: "bg-amber-400 text-white",
    2: "bg-zinc-300 text-zinc-800",
    3: "bg-orange-300 text-orange-900",
    4: "bg-zinc-500 text-white",
  };
  return (
    <span
      className={`inline-block w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${colors[rank] || "bg-zinc-200"}`}
    >
      {rank}
    </span>
  );
}

function HighlightDots({ summary }: { summary: AnalysisSummary }) {
  if (summary.highlights.length === 0) return null;
  const goods = summary.highlights.filter((h) => h.type === "good").length;
  const bads = summary.highlights.filter((h) => h.type === "bad").length;
  return (
    <div className="flex gap-1 items-center">
      {goods > 0 && (
        <span className="text-[10px] text-emerald-600 font-medium">
          +{goods}
        </span>
      )}
      {bads > 0 && (
        <span className="text-[10px] text-red-600 font-medium">
          -{bads}
        </span>
      )}
    </div>
  );
}

function HistoryCard({
  entry,
  onSelect,
  onRemove,
}: {
  entry: HistoryEntry;
  onSelect: () => void;
  onRemove: () => void;
}) {
  const s = entry.summary;
  const topHighlights = s.highlights.slice(0, 3);

  return (
    <div className="border border-zinc-200 rounded-lg bg-white overflow-hidden">
      <button
        type="button"
        onClick={onSelect}
        className="w-full text-left px-3 py-2.5 hover:bg-zinc-50 transition-colors"
      >
        {/* Header row */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <RankBadge rank={s.finalRank} />
            <span className="text-sm font-bold text-zinc-800 truncate">
              {entry.players[entry.targetPlayer]}
            </span>
          </div>
          <span className="text-[10px] text-zinc-400">
            {formatDate(entry.analyzedAt)}
          </span>
        </div>

        {/* Players */}
        <p className="text-[10px] text-zinc-400 truncate mb-1.5">
          {entry.players.join(" / ")}
        </p>

        {/* Stats row */}
        <div className="flex items-center gap-3 text-[10px] mb-1.5">
          <span className="text-zinc-500">
            <span className="font-bold text-zinc-700">{s.totalMoments}</span>{" "}
            判断
          </span>
          {s.dangerousPushes > 0 && (
            <span className="text-red-600">
              危険押し{s.dangerousPushes}回
            </span>
          )}
          {s.totalMoments > 0 && (
            <span className="text-zinc-500">
              EV {s.minPushEv > 0 ? "+" : ""}
              {s.minPushEv.toLocaleString()} 〜 {s.maxPushEv > 0 ? "+" : ""}
              {s.maxPushEv.toLocaleString()}
            </span>
          )}
          <HighlightDots summary={s} />
        </div>

        {/* Highlights preview */}
        {topHighlights.length > 0 && (
          <div className="space-y-0.5">
            {topHighlights.map((h, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[10px]">
                <span
                  className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    h.type === "good"
                      ? "bg-emerald-500"
                      : h.type === "bad"
                        ? "bg-red-500"
                        : "bg-zinc-400"
                  }`}
                />
                <span className="text-zinc-500 flex-shrink-0">{h.round}</span>
                <span className="text-zinc-700 truncate">{h.text}</span>
              </div>
            ))}
            {s.highlights.length > 3 && (
              <span className="text-[10px] text-zinc-400">
                ...他{s.highlights.length - 3}件
              </span>
            )}
          </div>
        )}
      </button>

      {/* Delete */}
      <div className="border-t border-zinc-100 px-3 py-1 flex justify-end">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="text-[10px] text-zinc-400 hover:text-red-500"
        >
          削除
        </button>
      </div>
    </div>
  );
}

export function HistoryList({
  history,
  onSelect,
  onRemove,
  onClear,
}: {
  history: HistoryEntry[];
  onSelect: (url: string) => void;
  onRemove: (url: string) => void;
  onClear: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  if (history.length === 0) return null;

  const visible = expanded ? history : history.slice(0, 3);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-700">
          履歴 ({history.length})
        </span>
        <button
          type="button"
          onClick={onClear}
          className="text-[10px] text-zinc-400 hover:text-red-500"
        >
          全て削除
        </button>
      </div>

      <div className="space-y-2">
        {visible.map((entry) => (
          <HistoryCard
            key={entry.url}
            entry={entry}
            onSelect={() => onSelect(entry.url)}
            onRemove={() => onRemove(entry.url)}
          />
        ))}
      </div>

      {history.length > 3 && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="w-full text-center text-xs text-zinc-500 hover:text-zinc-700 py-1"
        >
          {expanded
            ? "折りたたむ"
            : `他 ${history.length - 3} 件を表示`}
        </button>
      )}
    </div>
  );
}
