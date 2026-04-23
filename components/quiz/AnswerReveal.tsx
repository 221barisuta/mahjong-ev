import type { QuizScenario } from "@/lib/types";
import { calculateEv } from "@/lib/ev";
import BreakdownPanel from "@/components/calculator/BreakdownPanel";

interface AnswerRevealProps {
  scenario: QuizScenario;
  userAnswer: "push" | "fold";
}

export default function AnswerReveal({ scenario, userAnswer }: AnswerRevealProps) {
  const result = calculateEv(scenario.input);
  const correctAnswer = scenario.answer === "neutral" ? "push" : scenario.answer;
  const isCorrect = userAnswer === correctAnswer;

  return (
    <div className="space-y-3">
      <div
        className={`rounded-lg p-3 text-sm ${
          isCorrect
            ? "bg-emerald-50 border border-emerald-300"
            : "bg-red-50 border border-red-300"
        }`}
      >
        <p className="font-bold">
          {isCorrect ? "正解!" : "不正解"}
          {scenario.answer === "neutral" && " (微妙なケース)"}
        </p>
        <p className="mt-1 text-zinc-700">{scenario.explanation}</p>
      </div>
      <BreakdownPanel input={scenario.input} result={result} />
    </div>
  );
}
