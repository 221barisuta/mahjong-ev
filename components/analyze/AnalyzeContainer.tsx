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
      if (!res.ok) {
        let upstreamStatus: number | undefined;
        try {
          const body = (await res.json()) as { status?: number };
          upstreamStatus = body.status;
        } catch {
          // ignore parse error
        }
        if (upstreamStatus === 404) {
          throw new Error(
            "この牌譜は取得制限があるため分析できません（特殊ロビー・トーナメント・期限切れなどの可能性）。古めの一般ロビー牌譜（鳳南/鳳東 0089/0009 等）でお試しください。",
          );
        }
        throw new Error(
          `牌譜の取得に失敗しました${upstreamStatus ? ` (upstream ${upstreamStatus})` : ""}`,
        );
      }
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
          className="w-full px-3.5 py-2.5 text-sm rounded-lg outline-none transition-colors"
          style={{
            background: "var(--c-card)",
            border: "1px solid var(--c-border)",
            color: "var(--c-text)",
          }}
          onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
        />
        <button
          type="button"
          onClick={() => handleAnalyze()}
          disabled={loading || !url}
          className="w-full py-2.5 rounded-lg font-bold text-sm transition-opacity disabled:opacity-50"
          style={{
            background: "var(--c-ink)",
            color: "#fff",
          }}
        >
          {loading ? "分析中..." : "分析する"}
        </button>
      </div>

      {error && (
        <div
          className="text-sm rounded-lg p-3"
          style={{
            background: "var(--c-fold-bg)",
            border: "1px solid var(--c-fold)",
            color: "var(--c-fold)",
          }}
        >
          {error}
        </div>
      )}

      {analysis && review && (
        <div className="space-y-3">
          <div
            className="rounded-2xl p-4"
            style={{
              background: "var(--c-card)",
              border: "1px solid var(--c-border)",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold">
                  {analysis.players[analysis.targetPlayer]} の牌譜
                </p>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: "var(--c-text-faint)" }}
                >
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

          <div
            className="flex p-1 rounded-lg"
            style={{
              background: "var(--c-card)",
              border: "1px solid var(--c-border)",
            }}
          >
            {([
              { key: "push" as const, label: "押し引き分析" },
              { key: "review" as const, label: "牌譜検討" },
            ] as const).map((t) => {
              const active = tab === t.key;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTab(t.key)}
                  className="flex-1 py-2 rounded-md text-xs md:text-[13px] font-semibold transition-colors"
                  style={{
                    background: active ? "var(--c-ink)" : "transparent",
                    color: active ? "#fff" : "var(--c-text-dim)",
                  }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          {tab === "push" ? (
            <>
              <SummaryPanel
                summary={analysis.summary}
                players={analysis.players}
                targetPlayer={analysis.targetPlayer}
              />
              <p
                className="text-xs"
                style={{ color: "var(--c-text-faint)" }}
              >
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
              <p
                className="text-xs leading-relaxed"
                style={{ color: "var(--c-text-faint)" }}
              >
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
