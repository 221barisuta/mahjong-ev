import { tileType } from "@/lib/tenhou/tiles";

export interface YakuSuggestion {
  yaku: string;
  feasibility: "high" | "medium";
  hint: string;
}

const HONOR_NAMES = ["東", "南", "西", "北", "白", "發", "中"];
const SUIT_NAMES = ["萬子", "筒子", "索子"] as const;

export function suggestYaku(handTileIds: number[]): YakuSuggestion[] {
  const counts = new Array<number>(34).fill(0);
  for (const id of handTileIds) counts[tileType(id)]++;

  const suggestions: YakuSuggestion[] = [];

  const yaochuCount = countYaochu(counts);
  if (yaochuCount === 0) {
    suggestions.push({
      yaku: "タンヤオ",
      feasibility: "high",
      hint: "幺九牌ゼロ。中張牌だけで進めれば自然にタンヤオ",
    });
  } else if (yaochuCount <= 3) {
    suggestions.push({
      yaku: "タンヤオ",
      feasibility: "medium",
      hint: `幺九牌 ${yaochuCount}枚を切ればタンヤオが見える`,
    });
  }

  const yakuhaiPairs: number[] = [];
  for (let t = 31; t < 34; t++) {
    if (counts[t] >= 2) yakuhaiPairs.push(t);
  }
  if (yakuhaiPairs.length > 0) {
    const names = yakuhaiPairs.map((t) => HONOR_NAMES[t - 27]).join("・");
    suggestions.push({
      yaku: "役牌",
      feasibility: "high",
      hint: `${names}を残してアガリ確定の役を1つ`,
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
  if (maxSuit + honorCount >= 10) {
    suggestions.push({
      yaku: maxSuit + honorCount === 14 || (maxSuit >= 11 && honorCount === 0)
        ? "清一色"
        : "混一色",
      feasibility: maxSuit + honorCount >= 12 ? "high" : "medium",
      hint: `${SUIT_NAMES[maxSuitIdx]}+字牌で${maxSuit + honorCount}枚。他色を切る`,
    });
  }

  let pairs = 0;
  let triplets = 0;
  for (let t = 0; t < 34; t++) {
    if (counts[t] >= 3) triplets++;
    else if (counts[t] === 2) pairs++;
  }
  if (triplets >= 2 || (triplets >= 1 && pairs >= 2) || pairs >= 4) {
    suggestions.push({
      yaku: "対々和",
      feasibility: triplets >= 2 ? "high" : "medium",
      hint: `刻子${triplets}・対子${pairs}。順子は崩して対子・刻子重視`,
    });
  }

  if (pairs >= 5) {
    suggestions.push({
      yaku: "七対子",
      feasibility: pairs >= 6 ? "high" : "medium",
      hint: `対子${pairs}組。孤立牌を残し対子を増やす`,
    });
  }

  return suggestions.slice(0, 3);
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
