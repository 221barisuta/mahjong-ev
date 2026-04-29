import type { QuizScenario } from "@/lib/types";
import { calculateEv } from "@/lib/ev";
import BreakdownPanel from "@/components/calculator/BreakdownPanel";

const formatSigned = (n: number) =>
  (n > 0 ? "+" : n < 0 ? "−" : "±") + Math.abs(n).toLocaleString("ja-JP");

export default function AnswerReveal({
  scenario,
  userAnswer,
}: {
  scenario: QuizScenario;
  userAnswer: "push" | "fold";
}) {
  const result = calculateEv(scenario.input);
  const correctAnswer =
    scenario.answer === "neutral" ? "push" : scenario.answer;
  const isCorrect = userAnswer === correctAnswer;
  const tone = isCorrect ? "push" : "fold";

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background:
          tone === "push" ? "var(--c-push-bg)" : "var(--c-fold-bg)",
        border: `2px solid ${tone === "push" ? "var(--c-push)" : "var(--c-fold)"}`,
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-10 h-10 md:w-11 md:h-11 rounded-full grid place-items-center text-xl font-extrabold flex-shrink-0"
            style={{
              background: tone === "push" ? "var(--c-push)" : "var(--c-fold)",
              color: "#fff",
            }}
          >
            {isCorrect ? "✓" : "✗"}
          </div>
          <div className="min-w-0">
            <div className="text-base md:text-lg font-bold">
              {isCorrect ? "正解" : "不正解"}
              {scenario.answer === "neutral" && " (微妙なケース)"}
              <span className="ml-1">— 正答は </span>
              <span
                style={{
                  color:
                    correctAnswer === "push"
                      ? "var(--c-push)"
                      : "var(--c-fold)",
                }}
              >
                {correctAnswer === "push" ? "押し" : "降り"}
              </span>
            </div>
            <div
              className="text-xs md:text-[13px] mt-1"
              style={{ color: "var(--c-text-dim)" }}
            >
              {scenario.explanation}
            </div>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div
            className="text-[10px] font-bold tracking-[0.15em]"
            style={{ color: "var(--c-text-faint)" }}
          >
            EV
          </div>
          <div
            className="font-num font-bold text-xl md:text-2xl tabular-nums"
            style={{
              color:
                result.pushEv >= 0
                  ? "var(--c-push)"
                  : "var(--c-fold)",
            }}
          >
            {formatSigned(result.pushEv)}
          </div>
        </div>
      </div>
      <BreakdownPanel input={scenario.input} result={result} />
    </div>
  );
}
