export type TileCode =
  | "1m" | "2m" | "3m" | "4m" | "5m" | "6m" | "7m" | "8m" | "9m"
  | "1p" | "2p" | "3p" | "4p" | "5p" | "6p" | "7p" | "8p" | "9p"
  | "1s" | "2s" | "3s" | "4s" | "5s" | "6s" | "7s" | "8s" | "9s"
  | "E" | "S" | "W" | "N" | "P" | "F" | "C";

export type TileTheme = "paper" | "dark" | "ink";

const HONOR_LABELS: Record<string, string> = {
  E: "東",
  S: "南",
  W: "西",
  N: "北",
  P: "白",
  F: "發",
  C: "中",
};

const NUM_KANJI = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九"];

export interface TileProps {
  code: TileCode;
  size?: number;
  theme?: TileTheme;
  glow?: boolean;
  danger?: boolean;
  dimmed?: boolean;
}

export function Tile({
  code,
  size = 40,
  glow = false,
  danger = false,
  dimmed = false,
}: TileProps) {
  const w = size;
  const h = Math.round(size * 1.36);

  const isHonor = /^[ESWNPFC]$/.test(code);
  const num = isHonor ? null : Number(code[0]);
  const suit = isHonor ? code : code[1];

  const borderColor = danger
    ? "#e74c3c"
    : glow
      ? "var(--c-warn)"
      : "var(--c-border-hi)";
  const borderWidth = danger || glow ? 2 : 1;
  const shadowColor = glow
    ? "rgba(212, 154, 22, 0.45)"
    : "rgba(40, 32, 20, 0.18)";

  return (
    <div
      className="inline-flex items-center justify-center select-none transition-all"
      style={{
        width: w,
        height: h,
        background:
          "linear-gradient(180deg, #fdf7e8 0%, #f7eed8 60%, #ebdfc0 100%)",
        border: `${borderWidth}px solid ${borderColor}`,
        borderRadius: Math.max(4, size * 0.14),
        boxShadow: glow
          ? `0 0 ${size * 0.3}px ${shadowColor}`
          : `0 1px 2px ${shadowColor}, inset 0 1px 0 rgba(255,255,255,0.55)`,
        opacity: dimmed ? 0.4 : 1,
        flexShrink: 0,
      }}
    >
      <TileGlyph num={num} suit={suit} isHonor={isHonor} size={size} />
    </div>
  );
}

function TileGlyph({
  num,
  suit,
  isHonor,
  size,
}: {
  num: number | null;
  suit: string;
  isHonor: boolean;
  size: number;
}) {
  if (isHonor) {
    const ch = HONOR_LABELS[suit];
    const color =
      suit === "C"
        ? "#a8261b"
        : suit === "F"
          ? "#1f6b41"
          : "#0e0d0b";
    return (
      <span
        style={{
          fontFamily:
            "var(--font-shippori-mincho), 'Noto Serif JP', serif",
          fontWeight: 800,
          color,
          fontSize: size * 0.7,
          lineHeight: 1,
        }}
      >
        {ch}
      </span>
    );
  }

  if (suit === "m" && num !== null) {
    const isFive = num === 5;
    return (
      <span
        className="flex flex-col items-center"
        style={{ gap: size * 0.04 }}
      >
        <span
          style={{
            fontFamily:
              "var(--font-shippori-mincho), 'Noto Serif JP', serif",
            fontWeight: 800,
            color: isFive ? "#a8261b" : "#0e0d0b",
            fontSize: size * 0.5,
            lineHeight: 1,
          }}
        >
          {NUM_KANJI[num]}
        </span>
        <span
          style={{
            fontFamily:
              "var(--font-shippori-mincho), 'Noto Serif JP', serif",
            fontWeight: 700,
            color: "#0e0d0b",
            fontSize: size * 0.32,
            lineHeight: 1,
          }}
        >
          萬
        </span>
      </span>
    );
  }

  if (suit === "p" && num !== null) {
    return <PinDots num={num} size={size} />;
  }

  if (suit === "s" && num !== null) {
    if (num === 1) {
      return (
        <span
          style={{
            fontSize: size * 0.7,
            lineHeight: 1,
            color: "#1f6b41",
          }}
        >
          🀐
        </span>
      );
    }
    return <SouSticks num={num} size={size} />;
  }

  return null;
}

const PIN_LAYOUT: Record<number, [number, number][]> = {
  1: [[0.5, 0.5]],
  2: [[0.5, 0.25], [0.5, 0.75]],
  3: [[0.25, 0.2], [0.5, 0.5], [0.75, 0.8]],
  4: [[0.3, 0.25], [0.7, 0.25], [0.3, 0.75], [0.7, 0.75]],
  5: [[0.3, 0.22], [0.7, 0.22], [0.5, 0.5], [0.3, 0.78], [0.7, 0.78]],
  6: [[0.3, 0.22], [0.7, 0.22], [0.3, 0.5], [0.7, 0.5], [0.3, 0.78], [0.7, 0.78]],
  7: [[0.3, 0.18], [0.5, 0.18], [0.7, 0.18], [0.3, 0.55], [0.7, 0.55], [0.3, 0.85], [0.7, 0.85]],
  8: [[0.3, 0.18], [0.7, 0.18], [0.3, 0.5], [0.5, 0.5], [0.7, 0.5], [0.3, 0.82], [0.5, 0.82], [0.7, 0.82]],
  9: [[0.25, 0.18], [0.5, 0.18], [0.75, 0.18], [0.25, 0.5], [0.5, 0.5], [0.75, 0.5], [0.25, 0.82], [0.5, 0.82], [0.75, 0.82]],
};

function PinDots({ num, size }: { num: number; size: number }) {
  const dots = PIN_LAYOUT[num] ?? [];
  const dotSize = num === 1 ? size * 0.4 : size * 0.18;
  return (
    <div
      className="relative"
      style={{ width: size * 0.8, height: size * 0.8 * 1.36 }}
    >
      {dots.map(([x, y], i) => {
        const isMiddle5 = num === 5 && i === 2;
        const color = isMiddle5 ? "#a8261b" : "#1c4f8a";
        return (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `calc(${x * 100}% - ${dotSize / 2}px)`,
              top: `calc(${y * 100}% - ${dotSize / 2}px)`,
              width: dotSize,
              height: dotSize,
              background: color,
              border: "1px solid rgba(0,0,0,0.2)",
            }}
          />
        );
      })}
    </div>
  );
}

const SOU_LAYOUT: Record<number, [number, number][]> = {
  2: [[0.5, 0.25], [0.5, 0.75]],
  3: [[0.25, 0.18], [0.5, 0.5], [0.75, 0.82]],
  4: [[0.3, 0.25], [0.7, 0.25], [0.3, 0.75], [0.7, 0.75]],
  5: [[0.3, 0.22], [0.7, 0.22], [0.5, 0.5], [0.3, 0.78], [0.7, 0.78]],
  6: [[0.3, 0.22], [0.7, 0.22], [0.3, 0.5], [0.7, 0.5], [0.3, 0.78], [0.7, 0.78]],
  7: [[0.5, 0.15], [0.3, 0.42], [0.7, 0.42], [0.3, 0.7], [0.7, 0.7], [0.3, 0.92], [0.7, 0.92]],
  8: [[0.3, 0.18], [0.7, 0.18], [0.25, 0.5], [0.5, 0.5], [0.75, 0.5], [0.25, 0.82], [0.5, 0.82], [0.75, 0.82]],
  9: [[0.25, 0.18], [0.5, 0.18], [0.75, 0.18], [0.25, 0.5], [0.5, 0.5], [0.75, 0.5], [0.25, 0.82], [0.5, 0.82], [0.75, 0.82]],
};

function SouSticks({ num, size }: { num: number; size: number }) {
  const sticks = SOU_LAYOUT[num] ?? [];
  const stickW = size * 0.12;
  const stickH = size * 0.32;
  return (
    <div
      className="relative"
      style={{ width: size * 0.8, height: size * 0.8 * 1.36 }}
    >
      {sticks.map(([x, y], i) => {
        const isMiddle5 = num === 5 && i === 2;
        const isMiddle7 = num === 7 && i === 0;
        const color = isMiddle5 || isMiddle7 ? "#a8261b" : "#1f6b41";
        return (
          <div
            key={i}
            className="absolute"
            style={{
              left: `calc(${x * 100}% - ${stickW / 2}px)`,
              top: `calc(${y * 100}% - ${stickH / 2}px)`,
              width: stickW,
              height: stickH,
              background: color,
              borderRadius: stickW * 0.4,
              border: "1px solid rgba(0,0,0,0.2)",
            }}
          />
        );
      })}
    </div>
  );
}

const HONOR_CHARS = ["E", "S", "W", "N", "P", "F", "C"] as const;

export function tileIdToCode(tileId: number): TileCode {
  const t = Math.floor(tileId / 4);
  if (t < 9) return `${t + 1}m` as TileCode;
  if (t < 18) return `${t - 9 + 1}p` as TileCode;
  if (t < 27) return `${t - 18 + 1}s` as TileCode;
  return HONOR_CHARS[t - 27] as TileCode;
}
