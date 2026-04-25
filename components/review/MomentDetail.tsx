import type { ReviewMoment } from "@/lib/mahjong/reviewer";
import { Tile, TileList } from "@/components/analyze/TileDisplay";
import { tileTypeToTileId } from "@/lib/mahjong/syanten-bridge";

export default function MomentDetail({ moment }: { moment: ReviewMoment }) {
  const severityColor =
    moment.severity === "bad"
      ? "border-red-300 bg-red-50"
      : moment.severity === "warn"
        ? "border-amber-300 bg-amber-50"
        : "border-zinc-200 bg-white";

  const severityLabel =
    moment.severity === "bad"
      ? { text: "悪手", color: "bg-red-600 text-white" }
      : moment.severity === "warn"
        ? { text: "要注意", color: "bg-amber-500 text-white" }
        : { text: "OK", color: "bg-emerald-100 text-emerald-700" };

  const shantenLabel =
    moment.shantenBefore === 0
      ? "聴牌"
      : `${moment.shantenBefore}向聴`;

  return (
    <div className={`rounded-lg border ${severityColor} p-3 space-y-2`}>
      <div className="flex items-center justify-between">
        <p className="text-xs text-zinc-600">
          {moment.turnNumber}巡目 ・ {shantenLabel}
          {moment.meldCount > 0 && ` ・ ${moment.meldCount}副露`}
        </p>
        <span
          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${severityLabel.color}`}
        >
          {severityLabel.text}
        </span>
      </div>

      <div>
        <p className="text-[10px] text-zinc-500 mb-1">手牌</p>
        <TileList tiles={moment.hand} highlightTile={moment.discardTile} />
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <DiscardCol
          label="実打牌"
          tileId={moment.discardTile}
          ukeire={moment.actualUkeire}
          waits={moment.actualWaits}
          worsened={moment.shantenWorsened}
        />
        {moment.bestDiscardTile !== null &&
          moment.bestDiscardTile !== moment.discardTile && (
            <DiscardCol
              label="最善打"
              tileId={moment.bestDiscardTile}
              ukeire={moment.bestUkeire}
              waits={moment.bestWaits}
              isBest
            />
          )}
      </div>

      {moment.shantenWorsened ? (
        <p className="text-xs text-red-700 font-medium">
          ⚠ この打牌で向聴数が悪化しています
        </p>
      ) : moment.loss > 0 ? (
        <p className="text-xs text-zinc-700">
          受け入れロス: <span className="font-bold">{moment.loss}枚</span>
        </p>
      ) : (
        <p className="text-xs text-emerald-700">受け入れ最大の打牌</p>
      )}

      {moment.yakuHints.length > 0 && (
        <div className="pt-2 border-t border-zinc-200">
          <p className="text-[10px] text-zinc-500 mb-1">手役サジェスト</p>
          <div className="space-y-1">
            {moment.yakuHints.map((h, i) => (
              <div key={i} className="text-xs">
                <span
                  className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold mr-1.5 ${
                    h.feasibility === "high"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-zinc-100 text-zinc-700"
                  }`}
                >
                  {h.yaku}
                </span>
                <span className="text-zinc-600">{h.hint}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DiscardCol({
  label,
  tileId,
  ukeire,
  waits,
  worsened,
  isBest,
}: {
  label: string;
  tileId: number;
  ukeire: number;
  waits: { tileType: number; count: number }[];
  worsened?: boolean;
  isBest?: boolean;
}) {
  return (
    <div className="bg-white rounded p-2 border border-zinc-200">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] text-zinc-500">{label}</span>
        {isBest && (
          <span className="text-[9px] px-1 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold">
            BEST
          </span>
        )}
      </div>
      <div className="flex items-center gap-1.5 mb-1">
        <Tile id={tileId} size="md" />
        <span className="text-xs">
          {worsened ? "—" : `${ukeire}枚`}
        </span>
      </div>
      {waits.length > 0 && (
        <div className="flex flex-wrap gap-0.5">
          {waits.map((w, i) => (
            <span
              key={i}
              className="text-[10px] bg-zinc-100 rounded px-1 py-0.5"
            >
              <Tile id={tileTypeToTileId(w.tileType)} />
              <span className="ml-0.5">×{w.count}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
