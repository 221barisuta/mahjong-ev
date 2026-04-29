import AnalyzeContainer from "@/components/analyze/AnalyzeContainer";

export default function AnalyzePage() {
  return (
    <div className="space-y-4">
      <div>
        <h1
          className="text-xl md:text-[22px] font-bold"
          style={{ letterSpacing: "-0.02em" }}
        >
          牌譜分析・検討
        </h1>
        <p
          className="text-xs md:text-sm mt-1"
          style={{ color: "var(--c-text-dim)" }}
        >
          天鳳の牌譜URLから押し引き判断＆受け入れ検討を切替表示
        </p>
      </div>
      <AnalyzeContainer />
    </div>
  );
}
