import QuizContainer from "@/components/quiz/QuizContainer";

export default function QuizPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-zinc-900">練習クイズ</h1>
        <p className="text-xs text-zinc-500">
          局面を見て押し/降りを判断 → 正解とEV計算内訳を確認
        </p>
      </div>
      <QuizContainer />
    </div>
  );
}
