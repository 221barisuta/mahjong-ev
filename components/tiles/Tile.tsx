import { Fragment } from "react";

export type TileCode =
  | "1m" | "2m" | "3m" | "4m" | "5m" | "6m" | "7m" | "8m" | "9m"
  | "1p" | "2p" | "3p" | "4p" | "5p" | "6p" | "7p" | "8p" | "9p"
  | "1s" | "2s" | "3s" | "4s" | "5s" | "6s" | "7s" | "8s" | "9s"
  | "E" | "S" | "W" | "N" | "P" | "F" | "C";

export type TileTheme = "paper" | "dark" | "ink";

const SUIT_LABELS: Record<string, string> = {
  E: "東",
  S: "南",
  W: "西",
  N: "北",
  F: "發",
  C: "中",
};

const NUM_KANJI = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九"];

const PIN_BLUE = "#1c4f8a";
const PIN_GREEN = "#1f6b41";
const PIN_RED = "#a8261b";
const SOU_GREEN = "#1f6b41";
const SOU_GREEN_LIGHT = "#2f8754";
const SOU_DARK = "#103924";
const RED_FIVE = "#a8261b";

interface Palette {
  face1: string;
  face2: string;
  face3: string;
  rim: string;
  edge: string;
  side: string;
  text: string;
  shadow1: string;
  shadow2: string;
  hi: string;
  lo: string;
  engrave: string;
}

const PALETTES: Record<TileTheme, Palette> = {
  paper: {
    face1: "#fdf7e8",
    face2: "#f7eed8",
    face3: "#ebdfc0",
    rim: "#7a6840",
    edge: "#c5b287",
    side: "#2d2620",
    text: "#0e0d0b",
    shadow1: "rgba(40,32,20,0.18)",
    shadow2: "rgba(40,32,20,0.32)",
    hi: "rgba(255,255,250,0.55)",
    lo: "rgba(60,45,25,0.10)",
    engrave: "rgba(0,0,0,0.18)",
  },
  dark: {
    face1: "#252b35",
    face2: "#1d2229",
    face3: "#15191f",
    rim: "#3a4150",
    edge: "#454d5e",
    side: "#0a0d12",
    text: "#e6ebf2",
    shadow1: "rgba(0,0,0,0.4)",
    shadow2: "rgba(0,0,0,0.6)",
    hi: "rgba(255,255,255,0.06)",
    lo: "rgba(0,0,0,0.25)",
    engrave: "rgba(0,0,0,0.5)",
  },
  ink: {
    face1: "#1d1a16",
    face2: "#15120e",
    face3: "#0c0a07",
    rim: "#3c342a",
    edge: "#4a4034",
    side: "#050403",
    text: "#e8e1d2",
    shadow1: "rgba(0,0,0,0.5)",
    shadow2: "rgba(0,0,0,0.7)",
    hi: "rgba(255,240,210,0.08)",
    lo: "rgba(0,0,0,0.4)",
    engrave: "rgba(0,0,0,0.55)",
  },
};

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
  size = 56,
  theme = "paper",
  glow = false,
  danger = false,
  dimmed = false,
}: TileProps) {
  const p = PALETTES[theme];
  const w = size;
  const h = size * 1.36;
  const r = size * 0.14;
  const isHonor = /^[ESWNPFC]$/.test(code);
  const num = isHonor ? null : code[0];
  const suit = isHonor ? code : code[1];
  const isP = code === "P";
  const fontSerif = "var(--font-shippori-mincho), 'Noto Serif JP', serif";

  let honorColor = p.text;
  if (code === "C") honorColor = theme === "paper" ? "#a8261b" : "#ff6b5e";
  if (code === "F") honorColor = theme === "paper" ? "#1f6b41" : "#6ee7b7";

  const isRedFive =
    num === "5" && (suit === "m" || suit === "p" || suit === "s");
  const u = `${code}-${theme}-${size}`;

  const dropShadow =
    glow
      ? `drop-shadow(0 0 18px ${theme === "dark" ? "rgba(110,231,183,0.55)" : "rgba(168,38,27,0.5)"})`
      : `drop-shadow(0 ${size * 0.02}px ${size * 0.04}px ${p.shadow1}) drop-shadow(0 ${size * 0.07}px ${size * 0.14}px ${p.shadow2})`;

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      style={{
        filter: dropShadow,
        opacity: dimmed ? 0.4 : 1,
        transition: "filter 220ms, opacity 220ms",
      }}
    >
      <defs>
        <linearGradient id={`g-${u}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.face1} />
          <stop offset="0.5" stopColor={p.face2} />
          <stop offset="1" stopColor={p.face3} />
        </linearGradient>
        <linearGradient id={`hi-${u}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.hi} stopOpacity="1" />
          <stop offset="0.45" stopColor={p.hi} stopOpacity="0.25" />
          <stop offset="1" stopColor={p.hi} stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`lo-${u}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.lo} stopOpacity="0" />
          <stop offset="0.7" stopColor={p.lo} stopOpacity="0.5" />
          <stop offset="1" stopColor={p.lo} stopOpacity="1" />
        </linearGradient>
        <filter
          id={`eng-${u}`}
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
        >
          <feOffset in="SourceAlpha" dx="0" dy={size * 0.018} />
          <feGaussianBlur stdDeviation={size * 0.012} result="blur" />
          <feFlood floodColor={p.engrave} floodOpacity="1" result="color" />
          <feComposite in="color" in2="blur" operator="in" result="colorblur" />
          <feMerge>
            <feMergeNode in="colorblur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect
        x="0.5"
        y={size * 0.1}
        width={w - 1}
        height={h - 1}
        rx={r}
        fill={p.side}
      />
      <rect
        x="0.5"
        y="0.5"
        width={w - 1}
        height={h - size * 0.08 - 0.5}
        rx={r}
        fill={`url(#g-${u})`}
      />
      <rect
        x={size * 0.04}
        y={size * 0.04}
        width={w - size * 0.08}
        height={h - size * 0.08 - size * 0.04 - 0.5}
        rx={r * 0.85}
        fill="none"
        stroke={p.rim}
        strokeWidth={Math.max(0.5, size * 0.012)}
        opacity="0.4"
      />
      <rect
        x="0.5"
        y="0.5"
        width={w - 1}
        height={h - size * 0.08 - 0.5}
        rx={r}
        fill="none"
        stroke={p.edge}
        strokeWidth="1"
      />
      <rect
        x={size * 0.04}
        y={size * 0.04}
        width={w - size * 0.08}
        height={size * 0.55}
        rx={r * 0.7}
        fill={`url(#hi-${u})`}
        pointerEvents="none"
      />
      <rect
        x={size * 0.04}
        y={size * 0.5}
        width={w - size * 0.08}
        height={size * 0.65}
        rx={r * 0.7}
        fill={`url(#lo-${u})`}
        pointerEvents="none"
      />
      {danger && (
        <rect
          x="2"
          y="2"
          width={w - 4}
          height={h - size * 0.08 - 3}
          rx={r - 1}
          fill="none"
          stroke="#e74c3c"
          strokeWidth="2"
        />
      )}
      <g filter={`url(#eng-${u})`}>
        <Glyph
          num={num}
          suit={suit}
          isHonor={isHonor}
          isP={isP}
          w={w}
          size={size}
          color={
            isHonor
              ? honorColor
              : isRedFive
                ? theme === "paper"
                  ? RED_FIVE
                  : "#ff6b5e"
                : p.text
          }
          fontSerif={fontSerif}
          theme={theme}
        />
      </g>
    </svg>
  );
}

interface GlyphProps {
  num: string | null;
  suit: string;
  isHonor: boolean;
  isP: boolean;
  w: number;
  size: number;
  color: string;
  fontSerif: string;
  theme: TileTheme;
}

function Glyph({
  num,
  suit,
  isHonor,
  isP,
  w,
  size,
  color,
  fontSerif,
  theme,
}: GlyphProps) {
  const cx = w / 2;
  if (isHonor) {
    if (isP) {
      const ix = w * 0.22;
      const iy = size * 0.22;
      const iw = w * 0.56;
      const ih = size * 0.92;
      const ring = theme === "paper" ? "#1c4f8a" : "#9bb6e3";
      return (
        <g>
          <rect
            x={ix}
            y={iy}
            width={iw}
            height={ih}
            rx={size * 0.06}
            fill="none"
            stroke={ring}
            strokeWidth={Math.max(1.5, size * 0.05)}
          />
          <rect
            x={ix + size * 0.075}
            y={iy + size * 0.075}
            width={iw - size * 0.15}
            height={ih - size * 0.15}
            rx={size * 0.04}
            fill="none"
            stroke={ring}
            strokeWidth={Math.max(1, size * 0.022)}
            opacity="0.55"
          />
        </g>
      );
    }
    return (
      <text
        x={cx}
        y={size * 0.95}
        textAnchor="middle"
        fontFamily={fontSerif}
        fontWeight="900"
        fontSize={size * 0.92}
        fill={color}
      >
        {SUIT_LABELS[suit]}
      </text>
    );
  }
  if (suit === "m" && num) {
    const isFive = +num === 5;
    const inkColor = theme === "paper" ? "#0e0d0b" : "#e6ebf2";
    return (
      <g>
        <text
          x={cx}
          y={size * 0.58}
          textAnchor="middle"
          fontFamily={fontSerif}
          fontWeight="800"
          fontSize={size * 0.62}
          fill={isFive ? color : inkColor}
        >
          {NUM_KANJI[+num]}
        </text>
        <text
          x={cx}
          y={size * 1.16}
          textAnchor="middle"
          fontFamily={fontSerif}
          fontWeight="900"
          fontSize={size * 0.55}
          fill={inkColor}
        >
          萬
        </text>
      </g>
    );
  }
  if (suit === "p" && num) {
    return <Pin num={+num} w={w} size={size} theme={theme} />;
  }
  if (suit === "s" && num) {
    if (+num === 1) return <SouOne w={w} size={size} theme={theme} />;
    return <Sou num={+num} w={w} size={size} theme={theme} />;
  }
  return null;
}

interface SuitProps {
  num: number;
  w: number;
  size: number;
  theme: TileTheme;
}

function Pin({ num, w, size, theme }: SuitProps) {
  type Pos = readonly [string, number, number];
  const P: Record<number, readonly Pos[]> = {
    1: [["big", 0.5, 0.5]],
    2: [["g", 0.5, 0.22], ["g", 0.5, 0.78]],
    3: [["b", 0.22, 0.18], ["g", 0.5, 0.5], ["r", 0.78, 0.82]],
    4: [["b", 0.25, 0.22], ["b", 0.75, 0.22], ["g", 0.25, 0.78], ["g", 0.75, 0.78]],
    5: [["b", 0.22, 0.20], ["g", 0.78, 0.20], ["r", 0.5, 0.5], ["g", 0.22, 0.80], ["b", 0.78, 0.80]],
    6: [["b", 0.25, 0.20], ["g", 0.75, 0.20], ["b", 0.25, 0.50], ["g", 0.75, 0.50], ["b", 0.25, 0.80], ["g", 0.75, 0.80]],
    7: [["r", 0.28, 0.16], ["r", 0.50, 0.16], ["r", 0.72, 0.16], ["b", 0.30, 0.55], ["b", 0.70, 0.55], ["b", 0.30, 0.86], ["b", 0.70, 0.86]],
    8: [["b", 0.28, 0.18], ["b", 0.72, 0.18], ["g", 0.25, 0.50], ["g", 0.50, 0.50], ["g", 0.75, 0.50], ["g", 0.25, 0.85], ["g", 0.50, 0.85], ["g", 0.75, 0.85]],
    9: [["b", 0.25, 0.18], ["g", 0.50, 0.18], ["r", 0.75, 0.18], ["g", 0.25, 0.50], ["r", 0.50, 0.50], ["b", 0.75, 0.50], ["r", 0.25, 0.82], ["b", 0.50, 0.82], ["g", 0.75, 0.82]],
  };
  const pat = P[num] || [];
  const colors: Record<string, string> =
    theme === "paper"
      ? { b: PIN_BLUE, g: PIN_GREEN, r: PIN_RED }
      : { b: "#5a8fce", g: "#4ea374", r: "#d04a3a" };
  const colorsHi: Record<string, string> =
    theme === "paper"
      ? { b: "#3a72b5", g: "#3a8d5e", r: "#c43d2e" }
      : { b: "#7da7df", g: "#74bf94", r: "#e66958" };
  const innerFill = theme === "paper" ? "#f7eed8" : "#1f242c";

  const fx0 = size * 0.10;
  const fx1 = w - size * 0.10;
  const fy0 = size * 0.10;
  const fy1 = size * 1.18;
  const mapX = (xf: number) => fx0 + xf * (fx1 - fx0);
  const mapY = (yf: number) => fy0 + yf * (fy1 - fy0);
  const span = fx1 - fx0;
  const baseR = num === 1 ? size * 0.30 : Math.min(size * 0.13, span * 0.13);

  return (
    <g>
      {pat.map((entry, i) => {
        const [c, xf, yf] = entry;
        const cx = mapX(xf);
        const cy = mapY(yf);
        if (c === "big") {
          const maxR = Math.min((fx1 - fx0) / 2 - 1, (fy1 - fy0) / 2 - 1);
          const R = Math.min(maxR, size * 0.32);
          const gradId = `pin1-${theme}-${size}`;
          return (
            <g key={i}>
              <defs>
                <radialGradient id={gradId} cx="0.4" cy="0.35" r="0.65">
                  <stop offset="0" stopColor={colorsHi.b} />
                  <stop offset="1" stopColor={colors.b} />
                </radialGradient>
                <radialGradient id={`${gradId}-r`} cx="0.4" cy="0.35" r="0.65">
                  <stop offset="0" stopColor={colorsHi.r} />
                  <stop offset="1" stopColor={colors.r} />
                </radialGradient>
              </defs>
              <circle cx={cx} cy={cy} r={R} fill={`url(#${gradId})`} />
              <circle cx={cx} cy={cy} r={R * 0.86} fill={innerFill} />
              <circle cx={cx} cy={cy} r={R * 0.66} fill={`url(#${gradId}-r)`} />
              <circle cx={cx} cy={cy} r={R * 0.52} fill={innerFill} />
              <circle cx={cx} cy={cy} r={R * 0.32} fill={colors.g} />
              <circle cx={cx} cy={cy} r={R * 0.14} fill={innerFill} />
            </g>
          );
        }
        const dotGrad = `dot-${c}-${theme}-${size}-${i}`;
        return (
          <g key={i}>
            <defs>
              <radialGradient id={dotGrad} cx="0.4" cy="0.35" r="0.65">
                <stop offset="0" stopColor={colorsHi[c]} />
                <stop offset="1" stopColor={colors[c]} />
              </radialGradient>
            </defs>
            <circle cx={cx} cy={cy} r={baseR} fill={`url(#${dotGrad})`} />
            <circle
              cx={cx}
              cy={cy}
              r={baseR * 0.62}
              fill="none"
              stroke={innerFill}
              strokeWidth={baseR * 0.18}
            />
            <circle cx={cx} cy={cy} r={baseR * 0.20} fill={innerFill} />
          </g>
        );
      })}
    </g>
  );
}

function Sou({ num, w, size, theme }: SuitProps) {
  const fx0 = size * 0.10;
  const fx1 = w - size * 0.10;
  const fy0 = size * 0.10;
  const fy1 = size * 1.18;
  const mapX = (xf: number) => fx0 + xf * (fx1 - fx0);
  const mapY = (yf: number) => fy0 + yf * (fy1 - fy0);

  type Pos = readonly [number, number] | readonly [number, number, "red"];
  const positions: Record<number, readonly Pos[]> = {
    2: [[0.5, 0.18], [0.5, 0.82]],
    3: [[0.22, 0.16], [0.5, 0.50], [0.78, 0.84]],
    4: [[0.25, 0.18], [0.75, 0.18], [0.25, 0.82], [0.75, 0.82]],
    5: [[0.25, 0.18], [0.75, 0.18], [0.5, 0.50, "red"], [0.25, 0.82], [0.75, 0.82]],
    6: [[0.25, 0.18], [0.75, 0.18], [0.25, 0.50], [0.75, 0.50], [0.25, 0.82], [0.75, 0.82]],
    7: [[0.5, 0.13, "red"], [0.30, 0.42], [0.70, 0.42], [0.30, 0.70], [0.70, 0.70], [0.30, 0.95], [0.70, 0.95]],
    8: [[0.25, 0.16], [0.75, 0.16], [0.22, 0.50], [0.50, 0.50], [0.78, 0.50], [0.22, 0.84], [0.50, 0.84], [0.78, 0.84]],
    9: [[0.22, 0.16], [0.50, 0.16], [0.78, 0.16], [0.22, 0.50], [0.50, 0.50], [0.78, 0.50], [0.22, 0.84], [0.50, 0.84], [0.78, 0.84]],
  };
  const ps = positions[num] || [];
  const rows = num <= 2 ? 2 : num === 3 ? 3 : num === 7 ? 4 : 3;
  const cols =
    num === 1
      ? 1
      : num === 2 || num === 3
        ? 1
        : num === 5 || num === 7
          ? 2
          : num === 8 || num === 9
            ? 3
            : 2;
  const stickH = ((fy1 - fy0) / rows) * 0.78;
  const stickW = Math.min(
    size * 0.11,
    ((fx1 - fx0) / Math.max(cols, 2)) * 0.34,
  );

  const dark = theme === "paper" ? SOU_DARK : "#1c4a36";
  const light = theme === "paper" ? SOU_GREEN : "#42b07a";
  const lightHi = theme === "paper" ? SOU_GREEN_LIGHT : "#5fc592";
  const redHi = theme === "paper" ? "#c43d2e" : "#ff8a7e";

  const gradKey = `sou-${theme}-${size}-${num}`;

  return (
    <g>
      <defs>
        <linearGradient id={`${gradKey}-g`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={dark} />
          <stop offset="0.18" stopColor={light} />
          <stop offset="0.45" stopColor={lightHi} />
          <stop offset="0.7" stopColor={light} />
          <stop offset="1" stopColor={dark} />
        </linearGradient>
        <linearGradient id={`${gradKey}-r`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#5a1410" />
          <stop offset="0.5" stopColor={redHi} />
          <stop offset="1" stopColor="#5a1410" />
        </linearGradient>
      </defs>
      {ps.map((entry, i) => {
        const xf = entry[0];
        const yf = entry[1];
        const col = entry[2];
        const cx = mapX(xf);
        const cy = mapY(yf);
        const isRed = col === "red";
        const fill = isRed ? `url(#${gradKey}-r)` : `url(#${gradKey}-g)`;
        const stroke = isRed ? "#5a1410" : dark;
        const sw = Math.max(0.5, size * 0.018);
        return (
          <Fragment key={i}>
            <rect
              x={cx - stickW / 2}
              y={cy - stickH / 2}
              width={stickW}
              height={stickH}
              rx={stickW * 0.4}
              fill={fill}
              stroke={stroke}
              strokeWidth={sw}
            />
            <line
              x1={cx - stickW * 0.4}
              x2={cx + stickW * 0.4}
              y1={cy - stickH * 0.30}
              y2={cy - stickH * 0.30}
              stroke={stroke}
              strokeWidth={sw * 0.9}
            />
            <line
              x1={cx - stickW * 0.4}
              x2={cx + stickW * 0.4}
              y1={cy}
              y2={cy}
              stroke={stroke}
              strokeWidth={sw * 0.7}
              opacity="0.6"
            />
            <line
              x1={cx - stickW * 0.4}
              x2={cx + stickW * 0.4}
              y1={cy + stickH * 0.30}
              y2={cy + stickH * 0.30}
              stroke={stroke}
              strokeWidth={sw * 0.9}
            />
          </Fragment>
        );
      })}
    </g>
  );
}

function SouOne({
  w,
  size,
  theme,
}: {
  w: number;
  size: number;
  theme: TileTheme;
}) {
  const dark = theme === "paper" ? SOU_DARK : "#1c4a36";
  const light = theme === "paper" ? SOU_GREEN : "#42b07a";
  const lightBright = theme === "paper" ? SOU_GREEN_LIGHT : "#5fc592";
  const accent = theme === "paper" ? "#a8261b" : "#ff6b5e";
  const yellow = theme === "paper" ? "#cc9a25" : "#f0c552";

  const fw = w - size * 0.20;
  const fh = size * 1.08;
  const offX = size * 0.10;
  const offY = size * 0.10;
  const X = (u: number) => offX + u * fw;
  const Y = (u: number) => offY + u * fh;
  const sw = size * 0.022;
  const k = `bird-${theme}-${size}`;

  return (
    <g>
      <defs>
        <linearGradient id={`${k}-body`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={lightBright} />
          <stop offset="1" stopColor={light} />
        </linearGradient>
        <linearGradient id={`${k}-tail`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={lightBright} />
          <stop offset="1" stopColor={dark} />
        </linearGradient>
      </defs>
      <path
        d={`M ${X(0.62)} ${Y(0.50)} Q ${X(0.96)} ${Y(0.42)} ${X(0.92)} ${Y(0.78)} Q ${X(0.86)} ${Y(0.92)} ${X(0.72)} ${Y(0.78)} Z`}
        fill={`url(#${k}-tail)`}
        stroke={dark}
        strokeWidth={sw}
      />
      <path
        d={`M ${X(0.60)} ${Y(0.42)} Q ${X(0.95)} ${Y(0.20)} ${X(0.86)} ${Y(0.55)} Q ${X(0.78)} ${Y(0.62)} ${X(0.66)} ${Y(0.55)} Z`}
        fill={lightBright}
        stroke={dark}
        strokeWidth={sw}
      />
      <ellipse
        cx={X(0.45)}
        cy={Y(0.62)}
        rx={fw * 0.28}
        ry={fh * 0.20}
        fill={`url(#${k}-body)`}
        stroke={dark}
        strokeWidth={sw * 1.2}
      />
      <path
        d={`M ${X(0.30)} ${Y(0.55)} Q ${X(0.50)} ${Y(0.40)} ${X(0.66)} ${Y(0.62)} Q ${X(0.50)} ${Y(0.70)} ${X(0.30)} ${Y(0.62)} Z`}
        fill={dark}
        opacity="0.55"
      />
      <circle
        cx={X(0.20)}
        cy={Y(0.40)}
        r={fw * 0.13}
        fill={lightBright}
        stroke={dark}
        strokeWidth={sw * 1.2}
      />
      <circle cx={X(0.18)} cy={Y(0.36)} r={fw * 0.025} fill={dark} />
      <path
        d={`M ${X(0.05)} ${Y(0.42)} L ${X(-0.02)} ${Y(0.46)} L ${X(0.05)} ${Y(0.50)} Z`}
        fill={yellow}
        stroke={dark}
        strokeWidth={sw * 0.8}
      />
      <path
        d={`M ${X(0.20)} ${Y(0.28)} Q ${X(0.18)} ${Y(0.16)} ${X(0.10)} ${Y(0.18)} Q ${X(0.16)} ${Y(0.24)} ${X(0.20)} ${Y(0.28)} Z`}
        fill={accent}
        stroke={dark}
        strokeWidth={sw * 0.8}
      />
      <line
        x1={X(0.40)}
        x2={X(0.40)}
        y1={Y(0.82)}
        y2={Y(0.94)}
        stroke={accent}
        strokeWidth={size * 0.04}
      />
      <line
        x1={X(0.52)}
        x2={X(0.52)}
        y1={Y(0.82)}
        y2={Y(0.94)}
        stroke={accent}
        strokeWidth={size * 0.04}
      />
      <line
        x1={X(0.30)}
        x2={X(0.62)}
        y1={Y(0.96)}
        y2={Y(0.96)}
        stroke={dark}
        strokeWidth={sw * 1.5}
      />
    </g>
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
