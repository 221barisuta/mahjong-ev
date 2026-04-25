import type { ReviewSummary } from "@/lib/mahjong/reviewer";

export default function ReviewSummaryPanel({
  summary,
}: {
  summary: ReviewSummary;
}) {
  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-3 space-y-2">
      <p className="text-sm font-bold">サマリー</p>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <Stat label="検討対象打牌" value={`${summary.totalMoments} 回`} />
        <Stat
          label="平均受け入れ"
          value={`${summary.avgUkeire.toFixed(1)} 枚`}
        />
        <Stat
          label="要注意 (4枚以上ロス)"
          value={`${summary.warnCount} 回`}
          tone={summary.warnCount > 0 ? "warn" : undefined}
        />
        <Stat
          label="悪手 (8枚以上ロス)"
          value={`${summary.badCount} 回`}
          tone={summary.badCount > 0 ? "bad" : undefined}
        />
        <Stat
          label="累計ロス"
          value={`${summary.totalLoss} 枚`}
          tone={summary.totalLoss >= 20 ? "bad" : summary.totalLoss >= 10 ? "warn" : undefined}
        />
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "warn" | "bad";
}) {
  const color =
    tone === "bad"
      ? "text-red-700"
      : tone === "warn"
        ? "text-amber-700"
        : "text-zinc-900";
  return (
    <div className="bg-zinc-50 rounded-lg p-2">
      <p className="text-[10px] text-zinc-500">{label}</p>
      <p className={`text-sm font-bold ${color}`}>{value}</p>
    </div>
  );
}
