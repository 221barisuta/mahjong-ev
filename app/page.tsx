import EvCalculator from "@/components/calculator/EvCalculator";

export default function Home() {
  return (
    <div className="space-y-4">
      <div className="md:hidden">
        <h1 className="text-lg font-bold text-zinc-900">押し引きEV計算機</h1>
        <p className="text-xs text-zinc-500">5変数を入力して押し/降りをEVで判断</p>
      </div>
      <EvCalculator />
    </div>
  );
}
