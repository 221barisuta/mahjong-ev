import type { TenhouLog, ParsedRound } from "@/lib/tenhou/parser";
import { decodeMeldTiles } from "@/lib/tenhou/parser";
import { tileType, tileSort, classifyDanger, type DangerInfo } from "@/lib/tenhou/tiles";
import { computeHairi, tileTypeToTileId } from "./syanten-bridge";
import { suggestYaku, type YakuSuggestion } from "./yaku-suggest";

export type Severity = "ok" | "warn" | "bad";

export interface OpponentContext {
  player: number;
  name: string;
  isRiichi: boolean;
  riichiTurn: number | null;
  meldCount: number;
  totalDiscards: number;
  lastDiscard: number | null;
  lastDiscardTedashi: boolean | null;
  danger: DangerInfo;
  isDealer: boolean;
}

export interface ReviewMoment {
  turnNumber: number;
  hand: number[];
  discardTile: number;
  isTedashi: boolean;
  meldCount: number;
  shantenBefore: number;
  shantenWorsened: boolean;
  actualUkeire: number;
  actualWaits: { tileType: number; count: number }[];
  bestDiscardTile: number | null;
  bestUkeire: number;
  bestWaits: { tileType: number; count: number }[];
  loss: number;
  severity: Severity;
  yakuHints: YakuSuggestion[];
  opponents: OpponentContext[];
  worstDangerLabel: string;
  worstDangerRate: number;
}

export interface ReviewRound {
  name: string;
  scores: number[];
  dealer: number;
  outcome: string;
  moments: ReviewMoment[];
}

export interface ReviewSummary {
  totalMoments: number;
  warnCount: number;
  badCount: number;
  totalLoss: number;
  avgUkeire: number;
}

export interface ReviewResult {
  players: string[];
  targetPlayer: number;
  rounds: ReviewRound[];
  summary: ReviewSummary;
}

export function reviewLog(log: TenhouLog, targetPlayer: number): ReviewResult {
  const rounds = log.rounds.map((r) => reviewRound(r, targetPlayer, log.players));
  const summary = buildSummary(rounds);
  return { players: log.players, targetPlayer, rounds, summary };
}

function buildSummary(rounds: ReviewRound[]): ReviewSummary {
  let warnCount = 0;
  let badCount = 0;
  let totalLoss = 0;
  let totalMoments = 0;
  let ukeireSum = 0;
  for (const r of rounds) {
    for (const m of r.moments) {
      totalMoments++;
      if (m.severity === "warn") warnCount++;
      if (m.severity === "bad") badCount++;
      totalLoss += m.loss;
      ukeireSum += m.actualUkeire;
    }
  }
  const avgUkeire = totalMoments > 0 ? ukeireSum / totalMoments : 0;
  return { totalMoments, warnCount, badCount, totalLoss, avgUkeire };
}

interface PlayerState {
  pond: number[];
  pondTedashi: boolean[];
  lastDrawnTile: number | null;
  meldCount: number;
  riichiActive: boolean;
  riichiTurn: number | null;
}

function reviewRound(
  round: ParsedRound,
  target: number,
  players: string[],
): ReviewRound {
  const hands: number[][] = round.hands.map((h) => [...h]);
  const states: PlayerState[] = [0, 1, 2, 3].map(() => ({
    pond: [],
    pondTedashi: [],
    lastDrawnTile: null,
    meldCount: 0,
    riichiActive: false,
    riichiTurn: null,
  }));
  let totalDraws = 0;
  const moments: ReviewMoment[] = [];

  for (const event of round.events) {
    switch (event.type) {
      case "draw":
        totalDraws++;
        hands[event.player].push(event.tile);
        states[event.player].lastDrawnTile = event.tile;
        break;

      case "discard": {
        const playerState = states[event.player];
        const isTedashi = playerState.lastDrawnTile !== event.tile;

        if (event.player === target && !states[target].riichiActive) {
          const moment = analyzeDiscard(
            hands[target],
            event.tile,
            Math.ceil(totalDraws / 4),
            states[target].meldCount,
            isTedashi,
            states,
            target,
            players,
            round.dealer,
          );
          if (moment) moments.push(moment);
        }

        playerState.pond.push(event.tile);
        playerState.pondTedashi.push(isTedashi);
        playerState.lastDrawnTile = null;

        const idx = hands[event.player].indexOf(event.tile);
        if (idx !== -1) hands[event.player].splice(idx, 1);
        break;
      }

      case "riichi":
        if (event.step === 2) {
          states[event.player].riichiActive = true;
          states[event.player].riichiTurn = Math.ceil(totalDraws / 4);
        }
        break;

      case "meld": {
        const tiles = decodeMeldTiles(event.meldData);
        for (const tile of tiles) {
          const idx = hands[event.player].indexOf(tile);
          if (idx !== -1) hands[event.player].splice(idx, 1);
        }
        states[event.player].meldCount++;
        break;
      }
    }
  }

  let outcome = "流局";
  const agariEvent = round.events.find((e) => e.type === "agari");
  if (agariEvent && agariEvent.type === "agari") {
    const isTsumo = agariEvent.who === agariEvent.fromWho;
    outcome = `${isTsumo ? "ツモ" : "ロン"} ${agariEvent.ten.toLocaleString()}点`;
  }

  return {
    name: round.name,
    scores: round.scores.map((s) => s * 100),
    dealer: round.dealer,
    outcome,
    moments,
  };
}

function buildOpponents(
  states: PlayerState[],
  target: number,
  players: string[],
  discardTile: number,
  dealer: number,
): { opponents: OpponentContext[]; worstLabel: string; worstRate: number } {
  const opponents: OpponentContext[] = [];
  let worstRate = 0;
  let worstLabel = "—";
  for (let p = 0; p < 4; p++) {
    if (p === target) continue;
    const s = states[p];
    const pondTypes = new Set(s.pond.map((t) => tileType(t)));
    const danger = classifyDanger(discardTile, pondTypes);
    if (danger.rate > worstRate) {
      worstRate = danger.rate;
      worstLabel = danger.label;
    }
    const lastIdx = s.pond.length - 1;
    opponents.push({
      player: p,
      name: players[p],
      isRiichi: s.riichiActive,
      riichiTurn: s.riichiTurn,
      meldCount: s.meldCount,
      totalDiscards: s.pond.length,
      lastDiscard: lastIdx >= 0 ? s.pond[lastIdx] : null,
      lastDiscardTedashi: lastIdx >= 0 ? s.pondTedashi[lastIdx] : null,
      danger,
      isDealer: p === dealer,
    });
  }
  return { opponents, worstLabel, worstRate };
}

function analyzeDiscard(
  hand14: number[],
  discardTileId: number,
  turnNumber: number,
  meldCount: number,
  isTedashi: boolean,
  states: PlayerState[],
  target: number,
  players: string[],
  dealer: number,
): ReviewMoment | null {
  const hairi = computeHairi(hand14);
  if (!hairi) return null;
  if (hairi.now < 0) return null;

  const discardType = tileType(discardTileId);
  const yakuHints = suggestYaku(hand14, hairi.now);

  const { opponents, worstLabel, worstRate } = buildOpponents(
    states,
    target,
    players,
    discardTileId,
    dealer,
  );

  const baseExtras = {
    turnNumber,
    hand: [...hand14].sort(tileSort),
    discardTile: discardTileId,
    isTedashi,
    meldCount,
    shantenBefore: hairi.now,
    yakuHints,
    opponents,
    worstDangerLabel: worstLabel,
    worstDangerRate: worstRate,
  };

  if (hairi.candidates.length === 0) {
    return {
      ...baseExtras,
      shantenWorsened: true,
      actualUkeire: 0,
      actualWaits: [],
      bestDiscardTile: null,
      bestUkeire: 0,
      bestWaits: [],
      loss: 0,
      severity: "bad",
    };
  }

  const best = hairi.candidates.reduce((a, b) => (b.ukeire > a.ukeire ? b : a));
  const actual = hairi.candidates.find((c) => c.discardType === discardType);

  if (!actual) {
    return {
      ...baseExtras,
      shantenWorsened: true,
      actualUkeire: 0,
      actualWaits: [],
      bestDiscardTile: best.discardType >= 0 ? tileTypeToTileId(best.discardType) : null,
      bestUkeire: best.ukeire,
      bestWaits: best.waits,
      loss: best.ukeire,
      severity: "bad",
    };
  }

  const loss = best.ukeire - actual.ukeire;
  let severity: Severity = "ok";
  if (loss >= 8) severity = "bad";
  else if (loss >= 4) severity = "warn";

  return {
    ...baseExtras,
    shantenWorsened: false,
    actualUkeire: actual.ukeire,
    actualWaits: actual.waits,
    bestDiscardTile: best.discardType >= 0 ? tileTypeToTileId(best.discardType) : null,
    bestUkeire: best.ukeire,
    bestWaits: best.waits,
    loss,
    severity,
  };
}
