import syanten from "syanten";
import { tileType } from "@/lib/tenhou/tiles";
import { tilesToHaiArr } from "./syanten-bridge";

export interface YakuSuggestion {
  yaku: string;
  feasibility: "high" | "medium";
  hint: string;
  estimatedShanten: number;
}

const HONOR_NAMES = ["東", "南", "西", "北", "白", "發", "中"];
const SUIT_NAMES = ["萬子", "筒子", "索子"] as const;

export function suggestYaku(
  handTileIds: number[],
  basicShanten: number,
): YakuSuggestion[] {
  const counts = new Array<number>(34).fill(0);
  for (const id of handTileIds) counts[tileType(id)]++;

  const candidates: YakuSuggestion[] = [];

  const yaochuCount = countYaochu(counts);
  if (yaochuCount === 0) {
    candidates.push({
      yaku: "タンヤオ",
      feasibility: "high",
      hint: "幺九牌ゼロ。中張牌だけで進めれば自然にタンヤオ",
      estimatedShanten: basicShanten,
    });
  } else if (yaochuCount <= 4) {
    candidates.push({
      yaku: "タンヤオ",
      feasibility: yaochuCount <= 2 ? "high" : "medium",
      hint: `幺九牌 ${yaochuCount}枚を切る`,
      estimatedShanten: basicShanten + Math.max(0, yaochuCount - 1),
    });
  }

  const yakuhaiPairs: { type: number; count: number }[] = [];
  for (let t = 31; t < 34; t++) {
    if (counts[t] >= 2) yakuhaiPairs.push({ type: t, count: counts[t] });
  }
  if (yakuhaiPairs.length > 0) {
    const best = yakuhaiPairs.reduce((a, b) => (b.count > a.count ? b : a));
    const name = HONOR_NAMES[best.type - 27];
    const need = Math.max(0, 3 - best.count);
    candidates.push({
      yaku: "役牌",
      feasibility: best.count >= 3 ? "high" : "medium",
      hint:
        best.count >= 3
          ? `${name}刻子で確定`
          : `${name}対子。あと1枚で刻子`,
      estimatedShanten: basicShanten + need,
    });
  }

  const suitCounts = [
    sumRange(counts, 0, 9),
    sumRange(counts, 9, 18),
    sumRange(counts, 18, 27),
  ];
  const honorCount = sumRange(counts, 27, 34);
  const maxSuit = Math.max(...suitCounts);
  const maxSuitIdx = suitCounts.indexOf(maxSuit);
  const honitsuTiles = maxSuit + honorCount;
  if (honitsuTiles >= 9) {
    const offSuit = handTileIds.length - honitsuTiles;
    const isPure = honorCount === 0 && maxSuit >= 11;
    candidates.push({
      yaku: isPure ? "清一色" : "混一色",
      feasibility: honitsuTiles >= 11 ? "high" : "medium",
      hint: `${SUIT_NAMES[maxSuitIdx]}+字牌で${honitsuTiles}枚。他色${offSuit}枚を切る`,
      estimatedShanten: basicShanten + Math.max(0, offSuit - 1),
    });
  }

  let pairs = 0;
  let triplets = 0;
  for (let t = 0; t < 34; t++) {
    if (counts[t] >= 3) triplets++;
    else if (counts[t] === 2) pairs++;
  }
  if (triplets >= 1 || pairs >= 3) {
    candidates.push({
      yaku: "対々和",
      feasibility: triplets >= 2 ? "high" : "medium",
      hint: `刻子${triplets}・対子${pairs}。鳴き活用で進める`,
      estimatedShanten: basicShanten + Math.max(0, 3 - triplets - Math.min(pairs, 3 - triplets)),
    });
  }

  const arr = tilesToHaiArr(handTileIds);
  const chitoitsuShanten =
    handTileIds.length === 13 || handTileIds.length === 14
      ? syanten.syanten7(arr)
      : 6;
  if (chitoitsuShanten <= 4 && pairs >= 3) {
    candidates.push({
      yaku: "七対子",
      feasibility: pairs >= 5 ? "high" : "medium",
      hint: `対子${pairs}組。孤立牌を残し対子化`,
      estimatedShanten: chitoitsuShanten,
    });
  }

  candidates.sort((a, b) => {
    const fa = a.feasibility === "high" ? 0 : 1;
    const fb = b.feasibility === "high" ? 0 : 1;
    if (fa !== fb) return fa - fb;
    return a.estimatedShanten - b.estimatedShanten;
  });

  return candidates.slice(0, 2);
}

function countYaochu(counts: number[]): number {
  let n = 0;
  n += counts[0] + counts[8];
  n += counts[9] + counts[17];
  n += counts[18] + counts[26];
  for (let t = 27; t < 34; t++) n += counts[t];
  return n;
}

function sumRange(counts: number[], start: number, end: number): number {
  let s = 0;
  for (let i = start; i < end; i++) s += counts[i];
  return s;
}
