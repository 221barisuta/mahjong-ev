"use client";

import { useState } from "react";
import { QUIZ_SCENARIOS } from "@/lib/constants";
import ScenarioCard from "./ScenarioCard";
import AnswerReveal from "./AnswerReveal";

export default function QuizContainer() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, "push" | "fold">>({});

  const scenario = QUIZ_SCENARIOS[currentIndex];
  const userAnswer = answers[scenario.id];

  const handleAnswer = (answer: "push" | "fold") => {
    setAnswers((prev) => ({ ...prev, [scenario.id]: answer }));
  };

  const next = () =>
    setCurrentIndex((i) => Math.min(QUIZ_SCENARIOS.length - 1, i + 1));

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <h1
            className="text-xl md:text-[22px] font-bold"
            style={{ letterSpacing: "-0.02em" }}
          >
            押し引き練習
          </h1>
          <p
            className="text-xs md:text-sm mt-1"
            style={{ color: "var(--c-text-dim)" }}
          >
            局面を見て判断 → 正解とEV内訳を確認
          </p>
        </div>
        <div className="flex gap-1.5">
          {QUIZ_SCENARIOS.map((s, i) => {
            const active = i === currentIndex;
            const done = !!answers[s.id];
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setCurrentIndex(i)}
                className="w-7 h-7 rounded-full grid place-items-center font-num font-bold text-xs"
                style={{
                  background: active
                    ? "var(--c-ink)"
                    : done
                      ? "var(--c-push)"
                      : "var(--c-bg)",
                  color:
                    active || done ? "#fff" : "var(--c-text-dim)",
                  border: `1px solid ${active ? "var(--c-ink)" : done ? "var(--c-push)" : "var(--c-border)"}`,
                }}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>

      <ScenarioCard
        scenario={scenario}
        index={currentIndex}
        total={QUIZ_SCENARIOS.length}
        onAnswer={handleAnswer}
        userAnswer={userAnswer}
      />

      {userAnswer && (
        <>
          <AnswerReveal scenario={scenario} userAnswer={userAnswer} />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() =>
                setAnswers((p) => {
                  const n = { ...p };
                  delete n[scenario.id];
                  return n;
                })
              }
              className="px-4 py-2.5 rounded-lg text-[13px] font-semibold"
              style={{
                background: "transparent",
                border: "1px solid var(--c-border-hi)",
                color: "var(--c-text-dim)",
              }}
            >
              もう一度
            </button>
            {currentIndex < QUIZ_SCENARIOS.length - 1 && (
              <button
                type="button"
                onClick={next}
                className="flex-1 py-2.5 rounded-lg text-[13px] font-bold"
                style={{ background: "var(--c-ink)", color: "#fff" }}
              >
                次の問題 →
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
