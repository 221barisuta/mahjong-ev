import type { ReviewSummary } from "@/lib/mahjong/reviewer";

export default function ReviewSummaryPanel({
  summary,
}: {
  summary: ReviewSummary;
}) {
  return (
    <div
      className="rounded-2xl p-4 space-y-3"
      style={{
        background: "var(--c-card)",
        border: "1px solid var(--c-border)",
      }}
    >
      <p
        className="text-[11px] font-bold tracking-[0.1em]"
        style={{ color: "var(--c-text-dim)" }}
      >
        サマリー
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        <Stat label="検討対象" value={`${summary.totalMoments}`} unit="回" />
        <Stat
          label="平均受け入れ"
          value={summary.avgUkeire.toFixed(1)}
          unit="枚"
          color="var(--c-push)"
        />
        <Stat
          label="要注意 (4枚以上)"
          value={`${summary.warnCount}`}
          unit="回"
          color={summary.warnCount > 0 ? "var(--c-warn)" : undefined}
        />
        <Stat
          label="悪手 (8枚以上)"
          value={`${summary.badCount}`}
          unit="回"
          color={summary.badCount > 0 ? "var(--c-fold)" : undefined}
        />
        <Stat
          label="累計ロス"
          value={`${summary.totalLoss}`}
          unit="枚"
          color={
            summary.totalLoss >= 20
              ? "var(--c-fold)"
              : summary.totalLoss >= 10
                ? "var(--c-warn)"
                : undefined
          }
        />
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  unit,
  color,
}: {
  label: string;
  value: string;
  unit?: string;
  color?: string;
}) {
  return (
    <div
      className="rounded-lg p-2.5"
      style={{ background: "var(--c-bg)" }}
    >
      <p
        className="text-[10px] font-semibold tracking-[0.1em]"
        style={{ color: "var(--c-text-faint)" }}
      >
        {label}
      </p>
      <p
        className="font-num font-bold text-base tabular-nums mt-0.5"
        style={{ color: color ?? "var(--c-text)" }}
      >
        {value}
        {unit && (
          <span
            className="text-[11px] ml-0.5"
            style={{ color: "var(--c-text-faint)" }}
          >
            {unit}
          </span>
        )}
      </p>
    </div>
  );
}
