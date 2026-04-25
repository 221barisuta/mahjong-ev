import syanten from "syanten";

export type HaiArr = Parameters<typeof syanten>[0];

export const VALID_HAND_SIZES = [14, 11, 8, 5, 2] as const;

export function tilesToHaiArr(tileIds: number[]): HaiArr {
  const arr: number[][] = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ];
  for (const id of tileIds) {
    const t = Math.floor(id / 4);
    if (t < 9) arr[0][t]++;
    else if (t < 18) arr[1][t - 9]++;
    else if (t < 27) arr[2][t - 18]++;
    else arr[3][t - 27]++;
  }
  return arr as unknown as HaiArr;
}

const SUIT_INDEX: Record<string, number> = { m: 0, p: 1, s: 2, z: 3 };

export function haiStringToTileType(s: string): number {
  const num = parseInt(s[0], 10);
  const suit = s[1];
  if (suit === "z") return 27 + (num - 1);
  return SUIT_INDEX[suit] * 9 + (num - 1);
}

export function tileTypeToHaiString(t: number): string {
  if (t < 9) return `${t + 1}m`;
  if (t < 18) return `${t - 9 + 1}p`;
  if (t < 27) return `${t - 18 + 1}s`;
  return `${t - 27 + 1}z`;
}

export function tileTypeToTileId(t: number): number {
  return t * 4;
}

export interface HairiResult {
  now: number;
  candidates: Array<{
    discardType: number;
    ukeire: number;
    waits: Array<{ tileType: number; count: number }>;
  }>;
}

export function computeHairi(tileIds: number[]): HairiResult | null {
  if (!VALID_HAND_SIZES.includes(tileIds.length as 14 | 11 | 8 | 5 | 2)) {
    return null;
  }
  const arr = tilesToHaiArr(tileIds);
  const raw = syanten.hairi(arr, true) as Record<string, unknown>;
  if (!raw || typeof raw !== "object" || typeof raw.now !== "number") {
    return null;
  }
  const now = raw.now;
  const candidates: HairiResult["candidates"] = [];
  for (const key of Object.keys(raw)) {
    if (key === "now") continue;
    const waits = raw[key] as Record<string, number> | undefined;
    if (!waits || typeof waits !== "object") continue;
    const waitList = Object.entries(waits).map(([k, c]) => ({
      tileType: haiStringToTileType(k),
      count: c,
    }));
    const ukeire = waitList.reduce((sum, w) => sum + w.count, 0);
    if (key === "wait") {
      candidates.push({ discardType: -1, ukeire, waits: waitList });
    } else {
      candidates.push({
        discardType: haiStringToTileType(key),
        ukeire,
        waits: waitList,
      });
    }
  }
  return { now, candidates };
}
