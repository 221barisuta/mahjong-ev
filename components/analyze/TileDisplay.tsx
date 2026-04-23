import { tileName, tileSuit } from "@/lib/tenhou/tiles";

const SUIT_COLORS: Record<string, string> = {
  m: "bg-red-100 text-red-800 border-red-300",
  p: "bg-blue-100 text-blue-800 border-blue-300",
  s: "bg-emerald-100 text-emerald-800 border-emerald-300",
  z: "bg-zinc-200 text-zinc-800 border-zinc-400",
};

export function Tile({
  id,
  highlight,
  size = "sm",
}: {
  id: number;
  highlight?: boolean;
  size?: "sm" | "md";
}) {
  const suit = tileSuit(id);
  const color = SUIT_COLORS[suit];
  const sizeClass = size === "md" ? "px-1.5 py-1 text-sm" : "px-1 py-0.5 text-xs";

  return (
    <span
      className={`inline-block rounded border font-mono font-bold ${color} ${sizeClass} ${
        highlight ? "ring-2 ring-amber-400" : ""
      }`}
    >
      {tileName(id)}
    </span>
  );
}

export function TileList({
  tiles,
  highlightTile,
}: {
  tiles: number[];
  highlightTile?: number;
}) {
  return (
    <div className="flex flex-wrap gap-0.5">
      {tiles.map((t, i) => (
        <Tile key={`${t}-${i}`} id={t} highlight={highlightTile === t} />
      ))}
    </div>
  );
}
