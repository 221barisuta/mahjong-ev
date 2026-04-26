import AnalyzeContainer from "@/components/analyze/AnalyzeContainer";

export default function AnalyzePage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-zinc-900">牌譜分析・検討</h1>
        <p className="text-xs text-zinc-500">
          天鳳の牌譜URLから押し引き判断＆受け入れ検討を切替表示
        </p>
      </div>
      <AnalyzeContainer />
    </div>
  );
}
