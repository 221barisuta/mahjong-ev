import { roundLabel } from "./tiles";

export interface TenhouLog {
  players: string[];
  rounds: ParsedRound[];
}

export interface ParsedRound {
  name: string;
  round: number;
  honba: number;
  riichiSticks: number;
  doraIndicators: number[];
  scores: number[]; // 100-point units as stored
  dealer: number;
  hands: number[][];
  events: GameEvent[];
}

export type GameEvent =
  | { type: "draw"; player: number; tile: number }
  | { type: "discard"; player: number; tile: number }
  | { type: "riichi"; player: number; step: number }
  | { type: "meld"; player: number; meldData: number }
  | {
      type: "agari";
      who: number;
      fromWho: number;
      ten: number;
      sc: number[];
    }
  | { type: "ryuukyoku" }
  | { type: "dora"; tile: number };

const DRAW_MAP: Record<string, number> = { T: 0, U: 1, V: 2, W: 3 };
const DISCARD_MAP: Record<string, number> = { D: 0, E: 1, F: 2, G: 3 };

function parseAttrs(str: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const re = /(\w+)="([^"]*)"/g;
  let m;
  while ((m = re.exec(str)) !== null) {
    attrs[m[1]] = m[2];
  }
  return attrs;
}

export function parseTenhouLog(xml: string): TenhouLog {
  // Player names
  const unMatch = xml.match(
    /<UN\s+n0="([^"]*)" n1="([^"]*)" n2="([^"]*)" n3="([^"]*)"/,
  );
  const players = unMatch
    ? [
        decodeURIComponent(unMatch[1]),
        decodeURIComponent(unMatch[2]),
        decodeURIComponent(unMatch[3]),
        decodeURIComponent(unMatch[4]),
      ]
    : ["Player 0", "Player 1", "Player 2", "Player 3"];

  // Split into rounds at each INIT tag
  const rounds: ParsedRound[] = [];
  const initRegex = /<INIT\s/g;
  const positions: number[] = [];
  let match;
  while ((match = initRegex.exec(xml)) !== null) {
    positions.push(match.index);
  }

  for (let i = 0; i < positions.length; i++) {
    const start = positions[i];
    const end = i + 1 < positions.length ? positions[i + 1] : xml.length;
    const chunk = xml.substring(start, end);
    const parsed = parseRoundChunk(chunk);
    if (parsed) rounds.push(parsed);
  }

  return { players, rounds };
}

function parseRoundChunk(xml: string): ParsedRound | null {
  const initMatch = xml.match(
    /<INIT\s+seed="([^"]*)" ten="([^"]*)" oya="(\d+)" hai0="([^"]*)" hai1="([^"]*)" hai2="([^"]*)" hai3="([^"]*)"/,
  );
  if (!initMatch) return null;

  const seed = initMatch[1].split(",").map(Number);
  const scores = initMatch[2].split(",").map(Number);
  const dealer = Number(initMatch[3]);
  const hands = [
    initMatch[4].split(",").map(Number),
    initMatch[5].split(",").map(Number),
    initMatch[6].split(",").map(Number),
    initMatch[7].split(",").map(Number),
  ];

  const events: GameEvent[] = [];
  const doraIndicators = [seed[5]];

  // Parse all tags
  const tagRegex = /<(\w+)(\s[^>]*)?\/?>/g;
  let m;
  let isFirstTag = true;

  while ((m = tagRegex.exec(xml)) !== null) {
    if (isFirstTag) {
      isFirstTag = false;
      continue;
    } // skip INIT tag itself

    const tag = m[1];
    const attrStr = m[2] || "";

    // Draw tags: T0-T135, U0-U135, V0-V135, W0-W135
    const firstChar = tag[0];
    const rest = tag.substring(1);

    if (firstChar in DRAW_MAP && /^\d+$/.test(rest)) {
      events.push({
        type: "draw",
        player: DRAW_MAP[firstChar],
        tile: Number(rest),
      });
      continue;
    }

    if (firstChar in DISCARD_MAP && /^\d+$/.test(rest)) {
      events.push({
        type: "discard",
        player: DISCARD_MAP[firstChar],
        tile: Number(rest),
      });
      continue;
    }

    if (tag === "REACH") {
      const attrs = parseAttrs(attrStr);
      events.push({
        type: "riichi",
        player: Number(attrs.who),
        step: Number(attrs.step),
      });
      continue;
    }

    if (tag === "N") {
      const attrs = parseAttrs(attrStr);
      events.push({
        type: "meld",
        player: Number(attrs.who),
        meldData: Number(attrs.m),
      });
      continue;
    }

    if (tag === "AGARI") {
      const attrs = parseAttrs(attrStr);
      const tenParts = attrs.ten.split(",").map(Number);
      const scParts = attrs.sc ? attrs.sc.split(",").map(Number) : [];
      events.push({
        type: "agari",
        who: Number(attrs.who),
        fromWho: Number(attrs.fromWho),
        ten: tenParts[1],
        sc: scParts,
      });
      continue;
    }

    if (tag === "RYUUKYOKU") {
      events.push({ type: "ryuukyoku" });
      continue;
    }

    if (tag === "DORA") {
      const attrs = parseAttrs(attrStr);
      const doraTile = Number(attrs.hai);
      doraIndicators.push(doraTile);
      events.push({ type: "dora", tile: doraTile });
      continue;
    }
  }

  return {
    name: roundLabel(seed[0], seed[1]),
    round: seed[0],
    honba: seed[1],
    riichiSticks: seed[2],
    doraIndicators,
    scores,
    dealer,
    hands,
    events,
  };
}

// Decode meld to get tiles involved (for hand tracking)
export function decodeMeldTiles(m: number): number[] {
  if (m & 0x4) {
    // Chi
    const pattern = m >> 10;
    const base = Math.floor(pattern / 3);
    const suit = Math.floor(base / 7);
    const num = base % 7;
    const startType = suit * 9 + num;
    return [
      startType * 4 + ((m >> 3) & 0x3),
      (startType + 1) * 4 + ((m >> 5) & 0x3),
      (startType + 2) * 4 + ((m >> 7) & 0x3),
    ];
  }

  if (m & 0x8) {
    // Pon
    const unused = (m >> 5) & 0x3;
    const tmp = m >> 9;
    const tt = Math.floor(tmp / 3);
    return [0, 1, 2, 3]
      .filter((i) => i !== unused)
      .map((i) => tt * 4 + i);
  }

  if (m & 0x10) {
    // Kakan - single tile added
    const tmp = m >> 9;
    const tt = Math.floor(tmp / 3);
    const which = (m >> 5) & 0x3;
    return [tt * 4 + which];
  }

  // Ankan / Daiminkan
  const hai0 = m >> 8;
  const tt = Math.floor(hai0 / 4);
  return [0, 1, 2, 3].map((i) => tt * 4 + i);
}
