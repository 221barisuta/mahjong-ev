import { RANK_ADJUSTMENT_TABLE } from "@/lib/constants";

export default function RankAdjustmentTable() {
  return (
    <div
      className="rounded-2xl p-5 md:p-6"
      style={{
        background: "var(--c-card)",
        border: "1px solid var(--c-border)",
      }}
    >
      <div
        className="pb-3 mb-3"
        style={{ borderBottom: "1px solid var(--c-border)" }}
      >
        <div className="text-sm font-bold">順位補正</div>
        <div
          className="text-xs mt-1"
          style={{ color: "var(--c-text-dim)" }}
        >
          局面に応じてEVに加減算する点数
        </div>
      </div>
      <div className="flex flex-col">
        {RANK_ADJUSTMENT_TABLE.map((row) => {
          const color =
            row.adjustment > 0
              ? "var(--c-push)"
              : row.adjustment < 0
                ? "var(--c-fold)"
                : "var(--c-text-faint)";
          return (
            <div
              key={row.key}
              className="grid items-start gap-3 py-2.5 px-1"
              style={{
                gridTemplateColumns: "minmax(140px,1fr) auto",
                borderBottom: "1px solid var(--c-border)",
              }}
            >
              <div>
                <div className="text-xs md:text-sm font-semibold">
                  {row.label}
                </div>
                <div
                  className="text-[11px] mt-0.5"
                  style={{ color: "var(--c-text-faint)" }}
                >
                  {row.description}
                </div>
              </div>
              <div
                className="font-num font-bold text-sm tabular-nums text-right whitespace-nowrap"
                style={{ color }}
              >
                {row.adjustment === 0
                  ? "±0"
                  : `${row.adjustment > 0 ? "+" : "−"}${Math.abs(row.adjustment).toLocaleString()}`}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
