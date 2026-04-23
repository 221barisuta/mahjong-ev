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

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {QUIZ_SCENARIOS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setCurrentIndex(i)}
            className={`w-9 h-9 rounded-lg text-sm font-bold transition-colors ${
              i === currentIndex
                ? "bg-zinc-900 text-white"
                : answers[s.id]
                ? "bg-zinc-200 text-zinc-700"
                : "bg-zinc-100 text-zinc-500"
            }`}
          >
            {s.id}
          </button>
        ))}
      </div>

      <ScenarioCard
        scenario={scenario}
        onAnswer={handleAnswer}
        answered={!!userAnswer}
      />

      {userAnswer && (
        <AnswerReveal scenario={scenario} userAnswer={userAnswer} />
      )}

      {userAnswer && currentIndex < QUIZ_SCENARIOS.length - 1 && (
        <button
          type="button"
          onClick={() => setCurrentIndex((i) => i + 1)}
          className="w-full py-2.5 rounded-lg bg-zinc-900 text-white font-medium text-sm hover:bg-zinc-800 transition-colors"
        >
          次の問題へ
        </button>
      )}
    </div>
  );
}
