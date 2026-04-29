import type { AnalysisSummary } from "@/lib/tenhou/analyzer";

const RANK_BG: Record<number, string> = {
  1: "#d49a16",
  2: "#9a9a9a",
  3: "#d4623a",
  4: "#6a6a6a",
};

export default function SummaryPanel({
  summary,
  targetPlayer,
}: {
  summary: AnalysisSummary;
  players: string[];
  targetPlayer: number;
}) {
  const s = summary;

  return (
    <div
      className="rounded-2xl"
      style={{
        background: "var(--c-card)",
        border: "1px solid var(--c-border)",
      }}
    >
      <div
        className="px-4 py-3 flex items-center gap-3"
        style={{ borderBottom: "1px solid var(--c-border)" }}
      >
        <div
          className="w-9 h-9 rounded-full grid place-items-center text-xs font-bold text-white"
          style={{ background: RANK_BG[s.finalRank] }}
        >
          {s.finalRank}着
        </div>
        <div
          className="text-xs flex-1 font-num tabular-nums"
          style={{ color: "var(--c-text-dim)" }}
        >
          {s.finalScores.map((score, i) => (
            <span key={i}>
              {i > 0 && " / "}
              <span
                style={{
                  color:
                    i === targetPlayer
                      ? "var(--c-text)"
                      : "var(--c-text-dim)",
                  fontWeight: i === targetPlayer ? 700 : 500,
                }}
              >
                {score.toLocaleString()}
              </span>
            </span>
          ))}
        </div>
      </div>

      <div
        className="px-4 py-3 grid grid-cols-3 gap-2 text-center"
        style={{ borderBottom: "1px solid var(--c-border)" }}
      >
        <Stat label="判断箇所" value={s.totalMoments} />
        <Stat
          label="危険押し"
          value={s.dangerousPushes}
          color={s.dangerousPushes > 0 ? "var(--c-fold)" : undefined}
        />
        <Stat label="対象局" value={s.roundsWithAction.length} />
      </div>

      {s.totalMoments > 0 && (
        <div
          className="px-4 py-2.5 flex items-center justify-between text-xs"
          style={{ borderBottom: "1px solid var(--c-border)" }}
        >
          <span style={{ color: "var(--c-text-faint)" }}>EV範囲</span>
          <span className="font-num tabular-nums">
            <span
              style={{
                color:
                  s.minPushEv >= 0
                    ? "var(--c-push)"
                    : "var(--c-fold)",
              }}
            >
              {s.minPushEv > 0 ? "+" : ""}
              {s.minPushEv.toLocaleString()}
            </span>
            <span
              className="mx-1"
              style={{ color: "var(--c-text-faint)" }}
            >
              〜
            </span>
            <span
              style={{
                color:
                  s.maxPushEv >= 0
                    ? "var(--c-push)"
                    : "var(--c-fold)",
              }}
            >
              {s.maxPushEv > 0 ? "+" : ""}
              {s.maxPushEv.toLocaleString()}
            </span>
          </span>
        </div>
      )}

      {s.highlights.length > 0 && (
        <div className="px-4 py-3">
          <p
            className="text-[11px] font-bold tracking-[0.1em] mb-2"
            style={{ color: "var(--c-text-dim)" }}
          >
            見どころ
          </p>
          <div className="space-y-1.5">
            {s.highlights.map((h, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <span
                  className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{
                    background:
                      h.type === "good"
                        ? "var(--c-push)"
                        : h.type === "bad"
                          ? "var(--c-fold)"
                          : "var(--c-text-faint)",
                  }}
                />
                <span
                  className="font-num text-[11px] flex-shrink-0 w-14"
                  style={{ color: "var(--c-text-faint)" }}
                >
                  {h.round}
                </span>
                <span style={{ color: "var(--c-text)" }}>{h.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color?: string;
}) {
  return (
    <div>
      <p
        className="font-num font-bold text-lg tabular-nums"
        style={{ color: color ?? "var(--c-text)" }}
      >
        {value}
      </p>
      <p
        className="text-[10px] tracking-[0.1em] font-semibold"
        style={{ color: "var(--c-text-faint)" }}
      >
        {label}
      </p>
    </div>
  );
}
