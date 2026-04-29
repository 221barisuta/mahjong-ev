import type {
  ReviewMoment,
  OpponentContext,
  RelatedTedashi,
} from "@/lib/mahjong/reviewer";
import type { DangerInfo } from "@/lib/tenhou/tiles";
import { Tile, TileList } from "@/components/analyze/TileDisplay";
import { tileTypeToTileId } from "@/lib/mahjong/syanten-bridge";

export default function MomentDetail({ moment }: { moment: ReviewMoment }) {
  const severityStyle =
    moment.severity === "bad"
      ? {
          bg: "var(--c-fold-bg)",
          border: "var(--c-fold)",
        }
      : moment.severity === "warn"
        ? {
            bg: "#fdf3dc",
            border: "var(--c-warn)",
          }
        : {
            bg: "var(--c-card)",
            border: "var(--c-border)",
          };

  const severityBadge =
    moment.severity === "bad"
      ? { text: "悪手", bg: "var(--c-fold)", fg: "#fff" }
      : moment.severity === "warn"
        ? { text: "要注意", bg: "var(--c-warn)", fg: "#fff" }
        : { text: "OK", bg: "var(--c-push-bg)", fg: "var(--c-push)" };

  const shantenLabel =
    moment.shantenBefore === 0 ? "聴牌" : `${moment.shantenBefore}向聴`;

  const showBest =
    moment.bestDiscardTile !== null &&
    moment.bestDiscardTile !== moment.discardTile;

  return (
    <div
      className="rounded-xl p-3 space-y-2.5"
      style={{
        background: severityStyle.bg,
        border: `1px solid ${severityStyle.border}`,
      }}
    >
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <p
          className="text-xs flex items-center gap-1.5 flex-wrap"
          style={{ color: "var(--c-text-dim)" }}
        >
          <span className="font-num font-semibold">
            {moment.turnNumber}巡目
          </span>
          <span>・</span>
          <span className="font-semibold">{shantenLabel}</span>
          <span>・</span>
          <span
            className="px-1.5 py-0.5 rounded text-[10px] font-bold"
            style={{
              background: moment.isTedashi
                ? "#fbeae0"
                : "var(--c-bg)",
              color: moment.isTedashi
                ? "#a87618"
                : "var(--c-text-dim)",
            }}
          >
            {moment.isTedashi ? "手出し" : "ツモ切り"}
          </span>
          {moment.meldCount > 0 && (
            <>
              <span>・</span>
              <span>{moment.meldCount}副露</span>
            </>
          )}
        </p>
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{ background: severityBadge.bg, color: severityBadge.fg }}
        >
          {severityBadge.text}
        </span>
      </div>

      <div>
        <p
          className="text-[10px] font-semibold tracking-[0.1em] mb-1.5"
          style={{ color: "var(--c-text-faint)" }}
        >
          手牌
        </p>
        <TileList tiles={moment.hand} highlightTile={moment.discardTile} />
      </div>

      <div className={`grid ${showBest ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"} gap-2`}>
        <DiscardCol
          label="実打牌"
          tileId={moment.discardTile}
          ukeire={moment.actualUkeire}
          waits={moment.actualWaits}
          worsened={moment.shantenWorsened}
          worstDangerLabel={moment.worstActualDangerLabel}
          worstDangerRate={moment.worstActualDangerRate}
        />
        {showBest && moment.bestDiscardTile !== null && (
          <DiscardCol
            label="最善打"
            tileId={moment.bestDiscardTile}
            ukeire={moment.bestUkeire}
            waits={moment.bestWaits}
            isBest
            worstDangerLabel={moment.worstBestDangerLabel}
            worstDangerRate={moment.worstBestDangerRate}
          />
        )}
      </div>

      {moment.shantenWorsened ? (
        <p
          className="text-xs font-medium"
          style={{ color: "var(--c-fold)" }}
        >
          ⚠ この打牌で向聴数が悪化しています
        </p>
      ) : moment.loss > 0 ? (
        <p className="text-xs">
          受け入れロス:{" "}
          <span className="font-bold font-num">{moment.loss}枚</span>
        </p>
      ) : (
        <p
          className="text-xs"
          style={{ color: "var(--c-push)" }}
        >
          受け入れ最大の打牌
        </p>
      )}

      <OpponentsBlock
        opponents={moment.opponents}
        discardTile={moment.discardTile}
        bestTile={showBest ? moment.bestDiscardTile : null}
      />

      {moment.yakuHints.length > 0 && (
        <div
          className="pt-2.5 space-y-1.5"
          style={{ borderTop: "1px dashed var(--c-border)" }}
        >
          <p
            className="text-[10px] font-semibold tracking-[0.1em]"
            style={{ color: "var(--c-text-faint)" }}
          >
            手役サジェスト
          </p>
          <div className="space-y-1">
            {moment.yakuHints.map((h, i) => (
              <div
                key={i}
                className="text-xs flex items-baseline gap-1.5 flex-wrap"
              >
                <span
                  className="px-1.5 py-0.5 rounded text-[10px] font-bold"
                  style={{
                    background:
                      h.feasibility === "high"
                        ? "var(--c-push-bg)"
                        : "var(--c-bg)",
                    color:
                      h.feasibility === "high"
                        ? "var(--c-push)"
                        : "var(--c-text-dim)",
                  }}
                >
                  {h.yaku}
                </span>
                <span
                  className="text-[10px] font-num tabular-nums"
                  style={{ color: "var(--c-text-faint)" }}
                >
                  {h.estimatedShanten === 0
                    ? "聴牌"
                    : `${h.estimatedShanten}向聴`}
                </span>
                <span
                  className="flex-1"
                  style={{ color: "var(--c-text-dim)" }}
                >
                  {h.hint}
                </span>
              </div>
            ))}
          </div>
          <p
            className="text-[10px]"
            style={{ color: "var(--c-text-faint)" }}
          >
            ※役狙い時の向聴数は概算（拘束付シャンテンのヒューリスティック）
          </p>
        </div>
      )}
    </div>
  );
}

function OpponentsBlock({
  opponents,
  discardTile,
  bestTile,
}: {
  opponents: OpponentContext[];
  discardTile: number;
  bestTile: number | null;
}) {
  return (
    <div
      className="pt-2.5 space-y-1.5"
      style={{ borderTop: "1px dashed var(--c-border)" }}
    >
      <p
        className="text-[10px] font-semibold tracking-[0.1em]"
        style={{ color: "var(--c-text-faint)" }}
      >
        他家の状況・切牌の危険度
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5">
        {opponents.map((o) => (
          <OpponentMini
            key={o.player}
            opp={o}
            actualTile={discardTile}
            bestTile={bestTile}
          />
        ))}
      </div>
    </div>
  );
}

function OpponentMini({
  opp,
  actualTile,
  bestTile,
}: {
  opp: OpponentContext;
  actualTile: number;
  bestTile: number | null;
}) {
  return (
    <div
      className="rounded-lg p-2 space-y-1.5"
      style={{
        background: "var(--c-card)",
        border: "1px solid var(--c-border)",
      }}
    >
      <div className="flex items-center justify-between gap-1">
        <p className="text-[11px] font-bold truncate flex items-center gap-1">
          {opp.isDealer && (
            <span
              className="text-[9px] px-1 rounded font-bold"
              style={{
                background: "var(--c-fold-bg)",
                color: "var(--c-fold)",
              }}
            >
              親
            </span>
          )}
          <span className="truncate">{opp.name}</span>
        </p>
        {opp.isRiichi && (
          <span
            className="text-[9px] px-1 rounded font-bold flex-shrink-0"
            style={{
              background: "#fce7e7",
              color: "#b6342a",
            }}
          >
            リーチ{opp.riichiTurn ? `${opp.riichiTurn}巡` : ""}
          </span>
        )}
      </div>
      <div
        className="text-[10px] font-num tabular-nums"
        style={{ color: "var(--c-text-faint)" }}
      >
        {opp.totalDiscards}打
        {opp.meldCount > 0 ? ` ・ ${opp.meldCount}副露` : ""}
      </div>
      {opp.lastDiscard !== null && (
        <div className="flex items-center gap-1 text-[10px]">
          <span style={{ color: "var(--c-text-faint)" }}>直近:</span>
          <Tile id={opp.lastDiscard} />
          <span
            className="font-num"
            style={{ color: "var(--c-text-faint)" }}
          >
            {opp.lastDiscardTedashi ? "手" : "ツ"}
          </span>
        </div>
      )}

      <DangerLine
        labelTile={actualTile}
        prefix="実打"
        danger={opp.actualDanger}
        related={opp.actualRelatedTedashi}
      />
      {opp.bestDanger && bestTile !== null && (
        <DangerLine
          labelTile={bestTile}
          prefix="推奨"
          danger={opp.bestDanger}
          related={opp.bestRelatedTedashi}
        />
      )}
    </div>
  );
}

function DangerLine({
  labelTile,
  prefix,
  danger,
  related,
}: {
  labelTile: number;
  prefix: string;
  danger: DangerInfo;
  related: RelatedTedashi[];
}) {
  const tone =
    danger.rate === 0
      ? { bg: "var(--c-push-bg)", fg: "var(--c-push)", border: "var(--c-push)" }
      : danger.rate <= 5
        ? { bg: "var(--c-bg)", fg: "var(--c-text-dim)", border: "var(--c-border)" }
        : danger.rate <= 9
          ? { bg: "#fdf3dc", fg: "#a87618", border: "var(--c-warn)" }
          : { bg: "var(--c-fold-bg)", fg: "var(--c-fold)", border: "var(--c-fold)" };

  return (
    <div
      className="rounded text-[10px] px-1.5 py-1"
      style={{
        background: tone.bg,
        color: tone.fg,
        border: `1px solid ${tone.border}33`,
      }}
    >
      <div className="flex items-center gap-0.5 flex-wrap">
        <span className="font-bold">{prefix}</span>
        <Tile id={labelTile} />
        <span>:</span>
        <span className="font-semibold">{danger.label}</span>
        <span className="ml-auto font-num font-bold tabular-nums">
          {danger.rate}%
        </span>
      </div>
      {related.length > 0 && (
        <div
          className="flex items-center gap-1 flex-wrap mt-1 pt-1"
          style={{ borderTop: `1px dashed ${tone.border}55` }}
        >
          <span className="text-[9px]">近接手出:</span>
          {related.slice(0, 3).map((r, i) => (
            <span key={i} className="inline-flex items-center gap-0.5">
              <Tile id={r.tile} />
              <span className="text-[9px] font-num tabular-nums">
                {r.turn}巡
              </span>
            </span>
          ))}
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
  worstDangerLabel,
  worstDangerRate,
}: {
  label: string;
  tileId: number;
  ukeire: number;
  waits: { tileType: number; count: number }[];
  worsened?: boolean;
  isBest?: boolean;
  worstDangerLabel?: string;
  worstDangerRate?: number;
}) {
  return (
    <div
      className="rounded-lg p-2.5"
      style={{
        background: "var(--c-card)",
        border: "1px solid var(--c-border)",
      }}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span
          className="text-[10px] font-semibold tracking-[0.1em]"
          style={{ color: "var(--c-text-faint)" }}
        >
          {label}
        </span>
        {isBest && (
          <span
            className="text-[9px] px-1 py-0.5 rounded font-bold"
            style={{
              background: "var(--c-push-bg)",
              color: "var(--c-push)",
            }}
          >
            BEST
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 mb-1.5">
        <Tile id={tileId} size="md" />
        <span className="font-num font-bold text-sm tabular-nums">
          {worsened ? "—" : `${ukeire}枚`}
        </span>
      </div>
      {worstDangerLabel && worstDangerLabel !== "—" && (
        <div
          className="text-[10px] mb-1.5"
          style={{ color: "var(--c-text-faint)" }}
        >
          最大危険:{" "}
          <span
            className="font-bold"
            style={{ color: "var(--c-fold)" }}
          >
            {worstDangerLabel}
          </span>
          <span className="ml-1 font-num tabular-nums">
            {worstDangerRate}%
          </span>
        </div>
      )}
      {waits.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {waits.map((w, i) => (
            <span
              key={i}
              className="text-[10px] rounded px-1 py-0.5 inline-flex items-center gap-0.5"
              style={{ background: "var(--c-bg)" }}
            >
              <Tile id={tileTypeToTileId(w.tileType)} />
              <span className="font-num tabular-nums">×{w.count}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
