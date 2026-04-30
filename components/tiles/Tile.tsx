export type TileCode =
  | "1m" | "2m" | "3m" | "4m" | "5m" | "6m" | "7m" | "8m" | "9m"
  | "1p" | "2p" | "3p" | "4p" | "5p" | "6p" | "7p" | "8p" | "9p"
  | "1s" | "2s" | "3s" | "4s" | "5s" | "6s" | "7s" | "8s" | "9s"
  | "E" | "S" | "W" | "N" | "P" | "F" | "C";

export type TileTheme = "paper" | "dark" | "ink";

const FILE_NAMES: Record<TileCode, string> = {
  "1m": "Man1", "2m": "Man2", "3m": "Man3", "4m": "Man4", "5m": "Man5",
  "6m": "Man6", "7m": "Man7", "8m": "Man8", "9m": "Man9",
  "1p": "Pin1", "2p": "Pin2", "3p": "Pin3", "4p": "Pin4", "5p": "Pin5",
  "6p": "Pin6", "7p": "Pin7", "8p": "Pin8", "9p": "Pin9",
  "1s": "Sou1", "2s": "Sou2", "3s": "Sou3", "4s": "Sou4", "5s": "Sou5",
  "6s": "Sou6", "7s": "Sou7", "8s": "Sou8", "9s": "Sou9",
  E: "Ton", S: "Nan", W: "Shaa", N: "Pei",
  P: "Haku", F: "Hatsu", C: "Chun",
};

export interface TileProps {
  code: TileCode;
  size?: number;
  theme?: TileTheme;
  glow?: boolean;
  danger?: boolean;
  dimmed?: boolean;
  redFive?: boolean;
}

export function Tile({
  code,
  size = 36,
  glow = false,
  danger = false,
  dimmed = false,
  redFive = false,
}: TileProps) {
  const w = size;
  const h = Math.round(size * 1.36);

  const baseFile = FILE_NAMES[code];
  const useDora = redFive && (code === "5m" || code === "5p" || code === "5s");
  const fileName = useDora ? `${baseFile}-Dora` : baseFile;

  const filters: string[] = [];
  if (glow) {
    filters.push(`drop-shadow(0 0 ${size * 0.25}px rgba(212, 154, 22, 0.7))`);
  } else {
    filters.push(
      `drop-shadow(0 ${size * 0.02}px ${size * 0.04}px rgba(40,32,20,0.18))`,
    );
  }

  return (
    <span
      className="inline-flex items-center justify-center select-none flex-shrink-0 relative"
      style={{
        width: w,
        height: h,
        opacity: dimmed ? 0.4 : 1,
        filter: filters.join(" "),
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/tiles/${fileName}.svg`}
        alt={code}
        width={w}
        height={h}
        style={{ width: "100%", height: "100%", display: "block" }}
        draggable={false}
      />
      {danger && (
        <span
          className="absolute inset-0 pointer-events-none"
          style={{
            border: "2px solid #e74c3c",
            borderRadius: Math.max(4, size * 0.14),
            boxShadow: "0 0 6px rgba(231, 76, 60, 0.55)",
          }}
        />
      )}
    </span>
  );
}

const HONOR_CHARS: TileCode[] = ["E", "S", "W", "N", "P", "F", "C"];

export function tileIdToCode(tileId: number): TileCode {
  const t = Math.floor(tileId / 4);
  if (t < 9) return `${t + 1}m` as TileCode;
  if (t < 18) return `${t - 9 + 1}p` as TileCode;
  if (t < 27) return `${t - 18 + 1}s` as TileCode;
  return HONOR_CHARS[t - 27];
}
