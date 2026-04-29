import { Tile as RealTile, tileIdToCode } from "@/components/tiles/Tile";

const SIZE_PX: Record<"sm" | "md", number> = {
  sm: 26,
  md: 38,
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
  const px = SIZE_PX[size];
  return (
    <RealTile
      code={tileIdToCode(id)}
      size={px}
      theme="paper"
      glow={highlight}
    />
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
    <div className="flex flex-wrap gap-0.5 items-end">
      {tiles.map((t, i) => (
        <Tile
          key={`${t}-${i}`}
          id={t}
          highlight={highlightTile === t}
          size="sm"
        />
      ))}
    </div>
  );
}
