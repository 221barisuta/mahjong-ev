import { SCORE_TABLE } from "@/lib/constants";

export default function ScoreTable() {
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
        <div className="text-sm font-bold">打点早見表</div>
        <div
          className="text-xs mt-1"
          style={{ color: "var(--c-text-dim)" }}
        >
          翻数 × 子/親 ロン基準
        </div>
      </div>
      <div className="flex flex-col">
        <div
          className="grid gap-3 px-1 py-2 text-[11px] font-semibold tracking-[0.1em]"
          style={{
            gridTemplateColumns: "1fr 1fr 1fr",
            color: "var(--c-text-dim)",
            borderBottom: "1px solid var(--c-border)",
          }}
        >
          <div>翻数</div>
          <div className="text-right">子ロン</div>
          <div className="text-right">親ロン</div>
        </div>
        {SCORE_TABLE.map((row) => (
          <div
            key={row.han}
            className="grid items-center gap-3 py-2.5 px-1"
            style={{
              gridTemplateColumns: "1fr 1fr 1fr",
              borderBottom: "1px solid var(--c-border)",
            }}
          >
            <div className="text-sm font-semibold">{row.label}</div>
            <div
              className="font-num font-bold text-sm tabular-nums text-right"
              style={{ color: "var(--c-push)" }}
            >
              {row.child.toLocaleString()}
            </div>
            <div
              className="font-num font-bold text-sm tabular-nums text-right"
              style={{ color: "var(--c-push)" }}
            >
              {row.parent.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
      <div
        className="text-xs mt-3 pt-3 leading-6"
        style={{
          color: "var(--c-text-dim)",
          borderTop: "1px dashed var(--c-border)",
        }}
      >
        ※ リーチ補正: 一発約10%, 裏ドラ約30%, ツモ約40-47% → 打点1.3-1.5倍
      </div>
    </div>
  );
}
