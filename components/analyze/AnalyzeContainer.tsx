"use client";

import { useState } from "react";
import { parseTenhouLog } from "@/lib/tenhou/parser";
import { analyzeLog, type AnalysisResult } from "@/lib/tenhou/analyzer";
import RoundCard from "./RoundCard";
import UsageGuide from "./UsageGuide";
import {
  useFavorites,
  FavoriteButton,
  FavoritesList,
} from "./Favorites";
import { useHistory, HistoryList } from "./History";
import SummaryPanel from "./SummaryPanel";

export default function AnalyzeContainer() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { history, addHistory, removeHistory, clearHistory } = useHistory();

  const handleAnalyze = async (targetUrl?: string) => {
    const analyzeUrl = targetUrl || url;
    if (targetUrl) setUrl(targetUrl);
    setError("");
    setLoading(true);
    try {
      const match = analyzeUrl.match(/log=([^&]+)/);
      const twMatch = analyzeUrl.match(/tw=(\d)/);
      if (!match) {
        setError("天鳳の牌譜URLを入力してください");
        return;
      }
      const logId = match[1];
      const tw = twMatch ? Number(twMatch[1]) : 0;

      const res = await fetch(
        `/api/tenhou?log=${encodeURIComponent(logId)}`,
      );
      if (!res.ok) throw new Error("牌譜の取得に失敗しました");
      const xml = await res.text();

      const log = parseTenhouLog(xml);
      const analysis = analyzeLog(log, tw);
      setResult(analysis);

      // Auto-save to history
      addHistory({
        url: analyzeUrl,
        players: analysis.players,
        targetPlayer: analysis.targetPlayer,
        summary: analysis.summary,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const favoriteLabel = result
    ? `${result.players[result.targetPlayer]} (${result.players.join(" / ")})`
    : "";

  return (
    <div className="space-y-4">
      <UsageGuide />

      {/* Favorites */}
      <FavoritesList
        favorites={favorites}
        onSelect={(favUrl) => handleAnalyze(favUrl)}
        onRemove={removeFavorite}
      />

      {/* URL Input */}
      <div className="space-y-2">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="天鳳の牌譜URL (https://tenhou.net/0/?log=...&tw=N)"
          className="w-full border border-zinc-300 rounded-lg px-3 py-2.5 text-sm"
          onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
        />
        <button
          type="button"
          onClick={() => handleAnalyze()}
          disabled={loading || !url}
          className="w-full py-2.5 rounded-lg bg-zinc-900 text-white font-medium text-sm hover:bg-zinc-800 transition-colors disabled:opacity-50"
        >
          {loading ? "分析中..." : "分析する"}
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3">
          {error}
        </p>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-3">
          {/* Header */}
          <div className="bg-white rounded-xl border border-zinc-200 p-3">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-bold">
                  {result.players[result.targetPlayer]}の牌譜分析
                </p>
                <p className="text-xs text-zinc-500">
                  {result.players.join(" / ")}
                </p>
              </div>
              <FavoriteButton
                url={url}
                defaultLabel={favoriteLabel}
                isFavorite={isFavorite(url)}
                onAdd={addFavorite}
                onRemove={removeFavorite}
              />
            </div>
          </div>

          {/* Summary with highlights */}
          <SummaryPanel summary={result.summary} players={result.players} targetPlayer={result.targetPlayer} />

          <p className="text-xs text-zinc-500">
            ※ 和了率・期待打点はデフォルト値です。詳細を開いて手牌を確認し調整してください。
          </p>

          {result.rounds.map((round, i) => (
            <RoundCard
              key={i}
              round={round}
              players={result.players}
              targetPlayer={result.targetPlayer}
            />
          ))}
        </div>
      )}

      {/* History (shown when no result) */}
      {!result && (
        <HistoryList
          history={history}
          onSelect={(histUrl) => handleAnalyze(histUrl)}
          onRemove={removeHistory}
          onClear={clearHistory}
        />
      )}
    </div>
  );
}
