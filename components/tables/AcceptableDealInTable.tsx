import { ACCEPTABLE_DEAL_IN_TABLE } from "@/lib/constants";

const TIER_COLOR: Record<string, string> = {
  extreme: "#0a8754",
  high: "#3a9b4f",
  mid: "#d49a16",
  low: "#d4623a",
  min: "#c0392b",
};

function tierFor(rateNum: number): string {
  if (rateNum >= 25) return "extreme";
  if (rateNum >= 20) return "high";
  if (rateNum >= 12) return "mid";
  if (rateNum >= 6) return "low";
  return "min";
}

export default function AcceptableDealInTable() {
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
        <div className="text-sm font-bold">
          押し許容放銃率表{" "}
          <span
            className="ml-2 font-medium text-xs"
            style={{ color: "var(--c-text-faint)" }}
          >
            最重要
          </span>
        </div>
        <div
          className="text-xs mt-1"
          style={{ color: "var(--c-text-dim)" }}
        >
          自分の手の強さに対して、何%まで放銃を許容できるか
        </div>
      </div>
      <div className="flex flex-col">
        {ACCEPTABLE_DEAL_IN_TABLE.map((row) => {
          const tier = tierFor(row.rateNum);
          const color = TIER_COLOR[tier];
          const barPct = Math.min(100, row.rateNum * 4);
          return (
            <div
              key={row.label}
              className="grid items-center gap-3 py-2.5 px-1"
              style={{
                gridTemplateColumns: "minmax(140px,1fr) minmax(60px,2fr) auto",
                borderBottom: "1px solid var(--c-border)",
              }}
            >
              <div className="text-xs md:text-sm font-semibold">
                {row.label}
              </div>
              <div
                className="h-2 rounded-full overflow-hidden"
                style={{
                  background: "var(--c-bg)",
                  border: "1px solid var(--c-border)",
                }}
              >
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${barPct}%`, background: color }}
                />
              </div>
              <div
                className="font-num font-bold text-xs md:text-sm tabular-nums text-right whitespace-nowrap"
                style={{ color }}
              >
                {row.rate}
              </div>
            </div>
          );
        })}
      </div>
      <div
        className="text-xs mt-3 pt-3 leading-6"
        style={{
          color: "var(--c-text-dim)",
          borderTop: "1px dashed var(--c-border)",
        }}
      >
        ※ 押し許容率を上回る危険牌を切る場合は降りが原則。下回る場合は押して良い。
      </div>
    </div>
  );
}
