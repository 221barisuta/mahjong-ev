import { DEAL_IN_CATEGORIES } from "@/lib/constants";

const TIER_COLORS = [
  "#86c785",
  "#a4ce5a",
  "#cdc44a",
  "#dfa033",
  "#d4623a",
  "#b6342a",
];

export default function DealInCategoryTable() {
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
        <div className="text-sm font-bold">放銃率早見表</div>
        <div
          className="text-xs mt-1"
          style={{ color: "var(--c-text-dim)" }}
        >
          切る牌の種類別 (リーチ者基準)
        </div>
      </div>
      <div className="flex flex-col">
        {DEAL_IN_CATEGORIES.map((cat, i) => {
          const color = TIER_COLORS[i];
          const barPct = Math.min(100, cat.rate * 4.5);
          return (
            <div
              key={cat.key}
              className="grid items-center gap-3 py-2.5 px-1"
              style={{
                gridTemplateColumns: "minmax(120px,1fr) minmax(60px,2fr) auto",
                borderBottom: "1px solid var(--c-border)",
              }}
            >
              <div className="flex items-center gap-2 text-xs md:text-sm font-semibold">
                <span
                  className="w-2 h-2 rounded-full inline-block"
                  style={{ background: color }}
                />
                {cat.label}
              </div>
              <div
                className="h-2 rounded-full overflow-hidden"
                style={{
                  background: "var(--c-bg)",
                  border: "1px solid var(--c-border)",
                }}
              >
                <div
                  className="h-full rounded-full"
                  style={{ width: `${barPct}%`, background: color }}
                />
              </div>
              <div
                className="font-num font-bold text-xs md:text-sm tabular-nums text-right whitespace-nowrap"
                style={{ color }}
              >
                {cat.range}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
