import type { EvInput } from "@/lib/types";
import type { RankSituation } from "@/lib/types";
import { calculateEv } from "@/lib/ev";
import type { TenhouLog, ParsedRound } from "./parser";
import { decodeMeldTiles } from "./parser";
import {
  tileType,
  tileSort,
  tileName,
  classifyDanger,
  type DangerInfo,
} from "./tiles";

export interface AnalysisResult {
  players: string[];
  targetPlayer: number;
  rounds: RoundAnalysis[];
  summary: AnalysisSummary;
}

export interface AnalysisSummary {
  totalMoments: number;
  dangerousPushes: number;   // 無筋中張以上で押した場面数
  maxPushEv: number;
  minPushEv: number;
  roundsWithAction: string[];
  highlights: HighlightItem[];
  finalScores: number[];
  finalRank: number;         // 1-4
}

export interface HighlightItem {
  round: string;
  text: string;
  type: "good" | "bad" | "info";
}

export interface RoundAnalysis {
  name: string;
  scores: number[]; // actual points
  dealer: number;
  outcome: string;
  moments: PushFoldMoment[];
}

export interface PushFoldMoment {
  hand: number[];
  discardTile: number;
  turnNumber: number;
  remainingTurns: number;
  riichiPlayers: {
    player: number;
    name: string;
    isDealer: boolean;
    danger: DangerInfo;
  }[];
  combinedDangerRate: number;
  evInput: EvInput;
  targetInRiichi: boolean;
}

function estimateRankAdjustment(
  round: number,
  scores: number[],
  target: number,
): { key: RankSituation; adjustment: number } {
  const sorted = [...scores].sort((a, b) => b - a);
  const targetScore = scores[target];
  const rank = sorted.indexOf(targetScore);

  const isEast = round < 4;
  const isSouth = round >= 4;
  const isOras = round === 7;

  if (isEast) return { key: "east1to3", adjustment: 0 };

  if (isOras && rank === 3) {
    const diff = (sorted[2] - targetScore) * 100;
    return diff <= 8000
      ? { key: "orasLastChance", adjustment: 6000 }
      : { key: "orasNoChance", adjustment: -3000 };
  }

  if (isSouth) {
    if (rank === 0) {
      const diff = (targetScore - sorted[1]) * 100;
      return diff > 15000
        ? { key: "southTopBig", adjustment: -4000 }
        : { key: "southTopSmall", adjustment: -1500 };
    }
    if (rank === 1) return { key: "southSecond", adjustment: 0 };
    if (rank >= 2) return { key: "southThird", adjustment: 3000 };
  }

  return { key: "east1to3", adjustment: 0 };
}

export function analyzeLog(
  log: TenhouLog,
  targetPlayer: number,
): AnalysisResult {
  const rounds = log.rounds.map((r) =>
    analyzeRound(r, targetPlayer, log.players),
  );
  const summary = buildSummary(rounds, log, targetPlayer);
  return { players: log.players, targetPlayer, rounds, summary };
}

function buildSummary(
  rounds: RoundAnalysis[],
  log: TenhouLog,
  target: number,
): AnalysisSummary {
  const allMoments = rounds.flatMap((r) =>
    r.moments.map((m) => ({ ...m, round: r.name, outcome: r.outcome })),
  );
  const totalMoments = allMoments.length;

  let maxPushEv = -Infinity;
  let minPushEv = Infinity;
  let dangerousPushes = 0;
  const highlights: HighlightItem[] = [];
  const roundsWithAction: string[] = [];

  for (const r of rounds) {
    if (r.moments.length > 0) roundsWithAction.push(r.name);
  }

  for (const m of allMoments) {
    const ev = calculateEv(m.evInput).pushEv;
    if (ev > maxPushEv) maxPushEv = ev;
    if (ev < minPushEv) minPushEv = ev;
    if (m.combinedDangerRate >= 12) dangerousPushes++;
  }

  // Highlights: dangerous moments
  for (const r of rounds) {
    if (r.moments.length === 0) continue;

    const dangerMoments = r.moments.filter((m) => m.combinedDangerRate >= 12);
    const safeMoments = r.moments.filter((m) => m.combinedDangerRate === 0);

    if (dangerMoments.length > 0) {
      const tiles = dangerMoments.map((m) => tileName(m.discardTile)).join(", ");
      highlights.push({
        round: r.name,
        text: `無筋中張を${dangerMoments.length}回プッシュ (${tiles})`,
        type: "bad",
      });
    }
    if (safeMoments.length > 0 && safeMoments.length === r.moments.length) {
      highlights.push({
        round: r.name,
        text: `全${r.moments.length}打が現物 — 完全ベタオリ`,
        type: "good",
      });
    }

    // Outcome-based highlights (check all rounds, not just those with moments)
  }

  for (const r of rounds) {
    const targetName = log.players[target];

    // Target dealt in (放銃)
    if (r.outcome.includes("←") && r.outcome.endsWith(`← ${targetName}`)) {
      highlights.push({
        round: r.name,
        text: `放銃: ${r.outcome}`,
        type: "bad",
      });
    }
    // Target won by ron
    else if (r.outcome.includes("ロン") && r.outcome.startsWith(targetName)) {
      highlights.push({
        round: r.name,
        text: `ロン和了: ${r.outcome}`,
        type: "good",
      });
    }
    // Target won by tsumo
    else if (r.outcome.includes("ツモ") && r.outcome.startsWith(targetName)) {
      highlights.push({
        round: r.name,
        text: `ツモ和了: ${r.outcome}`,
        type: "good",
      });
    }
  }

  // Final scores from last round
  const lastRound = rounds[rounds.length - 1];
  const lastAgari = log.rounds[log.rounds.length - 1].events.find(
    (e) => e.type === "agari",
  );
  let finalScores = lastRound.scores;
  if (lastAgari && lastAgari.type === "agari" && lastAgari.sc.length >= 8) {
    finalScores = [0, 1, 2, 3].map(
      (i) => lastRound.scores[i] + lastAgari.sc[i * 2 + 1] * 100,
    );
  }

  const sorted = [...finalScores].sort((a, b) => b - a);
  const finalRank = sorted.indexOf(finalScores[target]) + 1;

  return {
    totalMoments,
    dangerousPushes,
    maxPushEv: totalMoments > 0 ? maxPushEv : 0,
    minPushEv: totalMoments > 0 ? minPushEv : 0,
    roundsWithAction,
    highlights,
    finalScores,
    finalRank,
  };
}

function analyzeRound(
  round: ParsedRound,
  target: number,
  players: string[],
): RoundAnalysis {
  const hands: number[][] = round.hands.map((h) => [...h]);
  const ponds: number[][] = [[], [], [], []];
  const riichiActive: boolean[] = [false, false, false, false];
  let totalDraws = 0;
  let targetInRiichi = false;

  const moments: PushFoldMoment[] = [];

  for (const event of round.events) {
    switch (event.type) {
      case "draw":
        totalDraws++;
        hands[event.player].push(event.tile);
        break;

      case "discard": {
        const idx = hands[event.player].indexOf(event.tile);
        if (idx !== -1) hands[event.player].splice(idx, 1);
        ponds[event.player].push(event.tile);

        // Check push/fold for target player
        if (event.player === target && !targetInRiichi) {
          const activeRiichi = riichiActive
            .map((active, p) => (active && p !== target ? p : -1))
            .filter((p) => p >= 0);

          if (activeRiichi.length > 0) {
            const riichiInfos = activeRiichi.map((p) => {
              const pondTypes = new Set(ponds[p].map((t) => tileType(t)));
              return {
                player: p,
                name: players[p],
                isDealer: p === round.dealer,
                danger: classifyDanger(event.tile, pondTypes),
              };
            });

            const combinedRate = Math.min(
              25,
              riichiInfos.reduce((sum, r) => sum + r.danger.rate, 0),
            );

            const anyDealer = riichiInfos.some((r) => r.isDealer);
            const remainingTurns = Math.max(
              1,
              Math.floor((70 - totalDraws) / 4),
            );
            const rankAdj = estimateRankAdjustment(
              round.round,
              round.scores,
              target,
            );

            moments.push({
              hand: [...hands[target]].sort(tileSort),
              discardTile: event.tile,
              turnNumber: Math.ceil(totalDraws / 4),
              remainingTurns,
              riichiPlayers: riichiInfos,
              combinedDangerRate: combinedRate,
              evInput: {
                winRate: 20,
                expectedScore: 5200,
                opponentScore: anyDealer ? 7000 : 5200,
                dealInRate: combinedRate,
                rankAdjustment: rankAdj.adjustment,
              },
              targetInRiichi,
            });
          }
        }
        break;
      }

      case "riichi":
        if (event.step === 2) {
          riichiActive[event.player] = true;
          if (event.player === target) targetInRiichi = true;
        }
        break;

      case "meld": {
        const tiles = decodeMeldTiles(event.meldData);
        for (const tile of tiles) {
          const idx = hands[event.player].indexOf(tile);
          if (idx !== -1) hands[event.player].splice(idx, 1);
        }
        break;
      }
    }
  }

  // Outcome
  let outcome = "流局";
  const agariEvent = round.events.find((e) => e.type === "agari");
  if (agariEvent && agariEvent.type === "agari") {
    const isTsumo = agariEvent.who === agariEvent.fromWho;
    const winner = players[agariEvent.who];
    outcome = `${winner} ${isTsumo ? "ツモ" : "ロン"} ${agariEvent.ten.toLocaleString()}点`;
    if (!isTsumo) {
      outcome += ` ← ${players[agariEvent.fromWho]}`;
    }
  }

  return {
    name: round.name,
    scores: round.scores.map((s) => s * 100),
    dealer: round.dealer,
    outcome,
    moments,
  };
}
