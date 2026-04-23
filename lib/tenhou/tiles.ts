const SUIT_CHARS = ["m", "p", "s"];
const HONOR_NAMES = ["東", "南", "西", "北", "白", "發", "中"];
const WIND_NAMES = ["東", "南", "西", "北"];

export function tileType(id: number): number {
  return Math.floor(id / 4);
}

export function tileName(id: number): string {
  const t = tileType(id);
  if (t < 27) return `${(t % 9) + 1}${SUIT_CHARS[Math.floor(t / 9)]}`;
  return HONOR_NAMES[t - 27];
}

export function tileSort(a: number, b: number): number {
  return tileType(a) - tileType(b);
}

export function isHonor(id: number): boolean {
  return tileType(id) >= 27;
}

export function roundLabel(round: number, honba: number): string {
  const wind = WIND_NAMES[Math.floor(round / 4)];
  const num = (round % 4) + 1;
  return `${wind}${num}局${honba > 0 ? ` ${honba}本場` : ""}`;
}

export function tileSuit(id: number): string {
  const t = tileType(id);
  if (t < 9) return "m";
  if (t < 18) return "p";
  if (t < 27) return "s";
  return "z";
}

export function tileNum(id: number): number {
  const t = tileType(id);
  if (t >= 27) return t - 27 + 1;
  return (t % 9) + 1;
}

// Returns tile types whose presence in the pond makes this tile suji-safe
export function sujiPartnerTypes(t: number): number[] {
  if (t >= 27) return [];
  const suit = Math.floor(t / 9);
  const num = t % 9; // 0-indexed: 0=1牌, 8=9牌
  const partners: number[] = [];
  if (num >= 3) partners.push(suit * 9 + (num - 3));
  if (num <= 5) partners.push(suit * 9 + (num + 3));
  return partners;
}

export interface DangerInfo {
  category: string;
  rate: number;
  label: string;
}

export function classifyDanger(
  tileId: number,
  riichiPondTypes: Set<number>,
): DangerInfo {
  const t = tileType(tileId);

  if (riichiPondTypes.has(t)) {
    return { category: "genbutsu", rate: 0, label: "現物" };
  }

  if (t >= 27) {
    return { category: "honor", rate: 5, label: "字牌(非現物)" };
  }

  const num = t % 9;
  const partners = sujiPartnerTypes(t);
  const isSuji = partners.some((p) => riichiPondTypes.has(p));
  const isTerm = num === 0 || num === 8;

  if (isTerm) {
    return isSuji
      ? { category: "suji19", rate: 4, label: "筋19牌" }
      : { category: "musuji19", rate: 9, label: "無筋19牌" };
  }

  if (isSuji) {
    const isAllSuji = partners.every((p) => riichiPondTypes.has(p));
    return isAllSuji
      ? { category: "sujiChuhan", rate: 5, label: "両筋中張牌" }
      : { category: "katasuji", rate: 7, label: "片筋中張牌" };
  }

  return { category: "musujiChuhan", rate: 14.5, label: "無筋中張牌" };
}

// Combine danger from multiple riichi players
export function combinedDanger(
  tileId: number,
  riichiPondsList: Set<number>[],
): { dangers: DangerInfo[]; totalRate: number; worstLabel: string } {
  const dangers = riichiPondsList.map((pond) => classifyDanger(tileId, pond));
  const totalRate = Math.min(
    25,
    dangers.reduce((sum, d) => sum + d.rate, 0),
  );
  const worst = dangers.reduce((a, b) => (a.rate >= b.rate ? a : b));
  return { dangers, totalRate, worstLabel: worst.label };
}
