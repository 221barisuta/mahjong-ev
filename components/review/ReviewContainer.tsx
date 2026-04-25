"use client";

import { useState } from "react";
import { parseTenhouLog } from "@/lib/tenhou/parser";
import { reviewLog, type ReviewResult } from "@/lib/mahjong/reviewer";
import ReviewSummaryPanel from "./ReviewSummaryPanel";
import ReviewRoundCard from "./ReviewRoundCard";

export default function ReviewContainer() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ReviewResult | null>(null);

  const handleRun = async () => {
    setError("");
    setLoading(true);
    try {
      const match = url.match(/log=([^&]+)/);
      const twMatch = url.match(/tw=(\d)/);
      if (!match) {
        setError("天鳳の牌譜URLを入力してください");
        return;
      }
      const logId = match[1];
      const tw = twMatch ? Number(twMatch[1]) : 0;
      const res = await fetch(`/api/tenhou?log=${encodeURIComponent(logId)}`);
      if (!res.ok) throw new Error("牌譜の取得に失敗しました");
      const xml = await res.text();
      const log = parseTenhouLog(xml);
      const review = reviewLog(log, tw);
      setResult(review);
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="天鳳の牌譜URL (https://tenhou.net/0/?log=...&tw=N)"
          className="w-full border border-zinc-300 rounded-lg px-3 py-2.5 text-sm"
          onKeyDown={(e) => e.key === "Enter" && handleRun()}
        />
        <button
          type="button"
          onClick={handleRun}
          disabled={loading || !url}
          className="w-full py-2.5 rounded-lg bg-zinc-900 text-white font-medium text-sm hover:bg-zinc-800 transition-colors disabled:opacity-50"
        >
          {loading ? "検討中..." : "牌譜を検討する"}
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3">{error}</p>
      )}

      {result && (
        <div className="space-y-3">
          <div className="bg-white rounded-xl border border-zinc-200 p-3">
            <p className="text-sm font-bold">
              {result.players[result.targetPlayer]} の牌譜検討
            </p>
            <p className="text-xs text-zinc-500">
              {result.players.join(" / ")}
            </p>
          </div>

          <ReviewSummaryPanel summary={result.summary} />

          <p className="text-xs text-zinc-500 leading-relaxed">
            ※ リーチ後の打牌は検討対象外。受け入れ枚数は標準形＋七対子＋国士の最良値で算出。
          </p>

          {result.rounds.map((r, i) => (
            <ReviewRoundCard key={i} round={r} />
          ))}
        </div>
      )}
    </div>
  );
}
