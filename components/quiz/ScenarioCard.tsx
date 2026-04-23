import type { QuizScenario } from "@/lib/types";

interface ScenarioCardProps {
  scenario: QuizScenario;
  onAnswer: (answer: "push" | "fold") => void;
  answered: boolean;
}

export default function ScenarioCard({
  scenario,
  onAnswer,
  answered,
}: ScenarioCardProps) {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-4 space-y-3">
      <div>
        <span className="text-xs bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full">
          問題 {scenario.id}
        </span>
        <h3 className="font-bold text-zinc-900 mt-1">{scenario.title}</h3>
      </div>

      <div className="text-sm space-y-1 text-zinc-700">
        <p><span className="font-medium">局面:</span> {scenario.situation}</p>
        <p><span className="font-medium">自分の手:</span> {scenario.hand}</p>
        <p><span className="font-medium">切る牌:</span> {scenario.tile}</p>
      </div>

      {!answered && (
        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={() => onAnswer("push")}
            className="flex-1 py-2.5 rounded-lg bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-600 transition-colors"
          >
            押し
          </button>
          <button
            type="button"
            onClick={() => onAnswer("fold")}
            className="flex-1 py-2.5 rounded-lg bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-colors"
          >
            降り
          </button>
        </div>
      )}
    </div>
  );
}
