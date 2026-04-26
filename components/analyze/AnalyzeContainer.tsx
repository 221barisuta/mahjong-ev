"use client";

import { useState } from "react";
import { parseTenhouLog } from "@/lib/tenhou/parser";
import { analyzeLog, type AnalysisResult } from "@/lib/tenhou/analyzer";
import { reviewLog, type ReviewResult } from "@/lib/mahjong/reviewer";
import RoundCard from "./RoundCard";
import UsageGuide from "./UsageGuide";
import {
  useFavorites,
  FavoriteButton,
  FavoritesList,
} from "./Favorites";
import { useHistory, HistoryList } from "./History";
import SummaryPanel from "./SummaryPanel";
import ReviewSummaryPanel from "@/components/review/ReviewSummaryPanel";
import ReviewRoundCard from "@/components/review/ReviewRoundCard";

type Tab = "push" | "review";

export default function AnalyzeContainer() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [review, setReview] = useState<ReviewResult | null>(null);
  const [tab, setTab] = useState<Tab>("push");
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
      const a = analyzeLog(log, tw);
      const r = reviewLog(log, tw);
      setAnalysis(a);
      setReview(r);

      addHistory({
        url: analyzeUrl,
        players: a.players,
        targetPlayer: a.targetPlayer,
        summary: a.summary,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const favoriteLabel = analysis
    ? `${analysis.players[analysis.targetPlayer]} (${analysis.players.join(" / ")})`
    : "";

  return (
    <div className="space-y-4">
      <UsageGuide />

      <FavoritesList
        favorites={favorites}
        onSelect={(favUrl) => handleAnalyze(favUrl)}
        onRemove={removeFavorite}
      />

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

      {analysis && review && (
        <div className="space-y-3">
          <div className="bg-white rounded-xl border border-zinc-200 p-3">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-bold">
                  {analysis.players[analysis.targetPlayer]}の牌譜
                </p>
                <p className="text-xs text-zinc-500">
                  {analysis.players.join(" / ")}
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

          <TabSwitcher tab={tab} onChange={setTab} />

          {tab === "push" ? (
            <>
              <SummaryPanel
                summary={analysis.summary}
                players={analysis.players}
                targetPlayer={analysis.targetPlayer}
              />
              <p className="text-xs text-zinc-500">
                ※ 和了率・期待打点はデフォルト値です。詳細を開いて手牌を確認し調整してください。
              </p>
              {analysis.rounds.map((round, i) => (
                <RoundCard
                  key={i}
                  round={round}
                  players={analysis.players}
                  targetPlayer={analysis.targetPlayer}
                />
              ))}
            </>
          ) : (
            <>
              <ReviewSummaryPanel summary={review.summary} />
              <p className="text-xs text-zinc-500 leading-relaxed">
                ※ リーチ後の打牌は検討対象外。受け入れ枚数は標準形＋七対子＋国士の最良値で算出。
              </p>
              {review.rounds.map((r, i) => (
                <ReviewRoundCard key={i} round={r} />
              ))}
            </>
          )}
        </div>
      )}

      {!analysis && (
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

function TabSwitcher({
  tab,
  onChange,
}: {
  tab: Tab;
  onChange: (t: Tab) => void;
}) {
  const tabs: { key: Tab; label: string }[] = [
    { key: "push", label: "押し引き分析" },
    { key: "review", label: "牌譜検討" },
  ];
  return (
    <div className="flex gap-1 bg-zinc-100 rounded-lg p-1">
      {tabs.map((t) => (
        <button
          key={t.key}
          type="button"
          onClick={() => onChange(t.key)}
          className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-colors ${
            tab === t.key
              ? "bg-white text-zinc-900 shadow-sm"
              : "text-zinc-500"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
