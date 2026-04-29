import EvCalculator from "@/components/calculator/EvCalculator";

export default function Home() {
  return (
    <div className="space-y-3 md:space-y-4">
      <div className="md:hidden">
        <h1 className="font-glyph text-2xl font-bold">押し引きEV</h1>
        <p
          className="text-xs font-num mt-0.5"
          style={{ color: "var(--c-text-faint)", letterSpacing: "0.05em" }}
        >
          quick · v2
        </p>
      </div>
      <EvCalculator />
    </div>
  );
}
