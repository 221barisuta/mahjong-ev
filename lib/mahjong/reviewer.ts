import type { TenhouLog, ParsedRound } from "@/lib/tenhou/parser";
import { decodeMeldTiles } from "@/lib/tenhou/parser";
import { tileType, tileSort } from "@/lib/tenhou/tiles";
import { computeHairi, tileTypeToTileId } from "./syanten-bridge";
import { suggestYaku, type YakuSuggestion } from "./yaku-suggest";

export type Severity = "ok" | "warn" | "bad";

export interface ReviewMoment {
  turnNumber: number;
  hand: number[];
  discardTile: number;
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
  const rounds = log.rounds.map((r) => reviewRound(r, targetPlayer));
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

function reviewRound(round: ParsedRound, target: number): ReviewRound {
  const hands: number[][] = round.hands.map((h) => [...h]);
  const meldCounts: number[] = [0, 0, 0, 0];
  let totalDraws = 0;
  let targetInRiichi = false;
  const moments: ReviewMoment[] = [];

  for (const event of round.events) {
    switch (event.type) {
      case "draw":
        totalDraws++;
        hands[event.player].push(event.tile);
        break;

      case "discard": {
        if (event.player === target && !targetInRiichi) {
          const moment = analyzeDiscard(
            hands[target],
            event.tile,
            Math.ceil(totalDraws / 4),
            meldCounts[target],
          );
          if (moment) moments.push(moment);
        }
        const idx = hands[event.player].indexOf(event.tile);
        if (idx !== -1) hands[event.player].splice(idx, 1);
        break;
      }

      case "riichi":
        if (event.step === 2 && event.player === target) {
          targetInRiichi = true;
        }
        break;

      case "meld": {
        const tiles = decodeMeldTiles(event.meldData);
        for (const tile of tiles) {
          const idx = hands[event.player].indexOf(tile);
          if (idx !== -1) hands[event.player].splice(idx, 1);
        }
        meldCounts[event.player]++;
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

function analyzeDiscard(
  hand14: number[],
  discardTileId: number,
  turnNumber: number,
  meldCount: number,
): ReviewMoment | null {
  const hairi = computeHairi(hand14);
  if (!hairi) return null;
  if (hairi.now < 0) return null;

  const discardType = tileType(discardTileId);
  const yakuHints = suggestYaku(hand14);

  if (hairi.candidates.length === 0) {
    return {
      turnNumber,
      hand: [...hand14].sort(tileSort),
      discardTile: discardTileId,
      meldCount,
      shantenBefore: hairi.now,
      shantenWorsened: true,
      actualUkeire: 0,
      actualWaits: [],
      bestDiscardTile: null,
      bestUkeire: 0,
      bestWaits: [],
      loss: 0,
      severity: "bad",
      yakuHints,
    };
  }

  const best = hairi.candidates.reduce((a, b) => (b.ukeire > a.ukeire ? b : a));
  const actual = hairi.candidates.find((c) => c.discardType === discardType);

  if (!actual) {
    return {
      turnNumber,
      hand: [...hand14].sort(tileSort),
      discardTile: discardTileId,
      meldCount,
      shantenBefore: hairi.now,
      shantenWorsened: true,
      actualUkeire: 0,
      actualWaits: [],
      bestDiscardTile: best.discardType >= 0 ? tileTypeToTileId(best.discardType) : null,
      bestUkeire: best.ukeire,
      bestWaits: best.waits,
      loss: best.ukeire,
      severity: "bad",
      yakuHints,
    };
  }

  const loss = best.ukeire - actual.ukeire;
  let severity: Severity = "ok";
  if (loss >= 8) severity = "bad";
  else if (loss >= 4) severity = "warn";

  return {
    turnNumber,
    hand: [...hand14].sort(tileSort),
    discardTile: discardTileId,
    meldCount,
    shantenBefore: hairi.now,
    shantenWorsened: false,
    actualUkeire: actual.ukeire,
    actualWaits: actual.waits,
    bestDiscardTile: best.discardType >= 0 ? tileTypeToTileId(best.discardType) : null,
    bestUkeire: best.ukeire,
    bestWaits: best.waits,
    loss,
    severity,
    yakuHints,
  };
}
