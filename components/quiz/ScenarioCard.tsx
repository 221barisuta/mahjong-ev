import type { QuizScenario } from "@/lib/types";
import { Tile, type TileCode } from "@/components/tiles/Tile";

export default function ScenarioCard({
  scenario,
  index,
  total,
  onAnswer,
  userAnswer,
}: {
  scenario: QuizScenario;
  index: number;
  total: number;
  onAnswer: (answer: "push" | "fold") => void;
  userAnswer?: "push" | "fold";
}) {
  const handTiles = (scenario.handTiles ?? []) as TileCode[];
  const cutTile = scenario.cutTile as TileCode | undefined;

  return (
    <div
      className="rounded-2xl p-5 md:p-7"
      style={{
        background: "var(--c-card)",
        border: "1px solid var(--c-border)",
      }}
    >
      <div
        className="text-[11px] font-bold tracking-[0.15em] mb-2"
        style={{ color: "var(--c-text-faint)" }}
      >
        問題 {index + 1} / {total}
      </div>
      <h2
        className="text-xl md:text-2xl font-bold mb-4"
        style={{ letterSpacing: "-0.02em" }}
      >
        {scenario.title}
      </h2>

      <div
        className="rounded-lg px-4 py-3 mb-5"
        style={{
          background: "var(--c-bg)",
          border: "1px solid var(--c-border)",
        }}
      >
        <MetaRow label="局面" value={scenario.situation} />
        <MetaRow label="自分の手" value={scenario.hand} />
        <MetaRow label="切る牌" value={scenario.tile} />
      </div>

      {handTiles.length > 0 && cutTile && (
        <div className="flex items-end flex-wrap gap-1 py-2 mb-5">
          {handTiles.map((t, i) => (
            <Tile key={i} code={t} size={36} />
          ))}
          <div style={{ width: 12 }} />
          <Tile code={cutTile} size={36} danger glow={!!userAnswer} />
        </div>
      )}

      {!userAnswer && (
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onAnswer("push")}
            className="rounded-2xl p-5 md:p-6 flex flex-col items-center gap-1.5 transition-transform active:scale-95"
            style={{
              background: "var(--c-push-bg)",
              border: "2px solid var(--c-push)",
              color: "var(--c-push)",
            }}
          >
            <div className="font-glyph text-3xl md:text-4xl font-extrabold">
              押
            </div>
            <div className="text-[11px] font-bold tracking-[0.2em]">
              PUSH
            </div>
          </button>
          <button
            type="button"
            onClick={() => onAnswer("fold")}
            className="rounded-2xl p-5 md:p-6 flex flex-col items-center gap-1.5 transition-transform active:scale-95"
            style={{
              background: "var(--c-fold-bg)",
              border: "2px solid var(--c-fold)",
              color: "var(--c-fold)",
            }}
          >
            <div className="font-glyph text-3xl md:text-4xl font-extrabold">
              降
            </div>
            <div className="text-[11px] font-bold tracking-[0.2em]">
              FOLD
            </div>
          </button>
        </div>
      )}
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="grid py-1.5 text-xs md:text-[13px]"
      style={{ gridTemplateColumns: "100px 1fr" }}
    >
      <div
        className="font-semibold"
        style={{ color: "var(--c-text-dim)" }}
      >
        {label}
      </div>
      <div>{value}</div>
    </div>
  );
}
