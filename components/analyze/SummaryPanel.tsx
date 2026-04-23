import type { AnalysisSummary } from "@/lib/tenhou/analyzer";

export default function SummaryPanel({
  summary,
  players,
  targetPlayer,
}: {
  summary: AnalysisSummary;
  players: string[];
  targetPlayer: number;
}) {
  const s = summary;
  const rankColors: Record<number, string> = {
    1: "bg-amber-400 text-white",
    2: "bg-zinc-400 text-white",
    3: "bg-orange-400 text-white",
    4: "bg-zinc-600 text-white",
  };

  return (
    <div className="bg-white rounded-xl border border-zinc-200 divide-y divide-zinc-100">
      {/* Stats row */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-center">
            <span
              className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${rankColors[s.finalRank]}`}
            >
              {s.finalRank}着
            </span>
          </div>
          <div className="text-xs text-zinc-500">
            {s.finalScores.map((score, i) => (
              <span key={i}>
                {i > 0 && " / "}
                <span
                  className={
                    i === targetPlayer ? "font-bold text-zinc-800" : ""
                  }
                >
                  {score.toLocaleString()}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Key numbers */}
      <div className="px-4 py-3 grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-lg font-bold text-zinc-800">
            {s.totalMoments}
          </p>
          <p className="text-[10px] text-zinc-500">判断箇所</p>
        </div>
        <div>
          <p className="text-lg font-bold text-red-600">
            {s.dangerousPushes}
          </p>
          <p className="text-[10px] text-zinc-500">危険押し</p>
        </div>
        <div>
          <p className="text-lg font-bold text-zinc-800">
            {s.roundsWithAction.length}
          </p>
          <p className="text-[10px] text-zinc-500">対象局</p>
        </div>
      </div>

      {/* EV range */}
      {s.totalMoments > 0 && (
        <div className="px-4 py-2.5 flex items-center justify-between text-xs">
          <span className="text-zinc-500">EV範囲</span>
          <span className="font-mono">
            <span className={s.minPushEv >= 0 ? "text-emerald-700" : "text-red-700"}>
              {s.minPushEv > 0 ? "+" : ""}{s.minPushEv.toLocaleString()}
            </span>
            <span className="text-zinc-400 mx-1">〜</span>
            <span className={s.maxPushEv >= 0 ? "text-emerald-700" : "text-red-700"}>
              {s.maxPushEv > 0 ? "+" : ""}{s.maxPushEv.toLocaleString()}
            </span>
          </span>
        </div>
      )}

      {/* Highlights */}
      {s.highlights.length > 0 && (
        <div className="px-4 py-3">
          <p className="text-xs font-semibold text-zinc-700 mb-2">見どころ</p>
          <div className="space-y-1.5">
            {s.highlights.map((h, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <span
                  className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                    h.type === "good"
                      ? "bg-emerald-500"
                      : h.type === "bad"
                        ? "bg-red-500"
                        : "bg-zinc-400"
                  }`}
                />
                <span className="text-zinc-500 flex-shrink-0 w-14">
                  {h.round}
                </span>
                <span className="text-zinc-700">{h.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
