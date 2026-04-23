import type { EvResult } from "@/lib/types";

interface ResultPanelProps {
  result: EvResult;
}

export default function ResultPanel({ result }: ResultPanelProps) {
  const isPush = result.decision === "push";

  return (
    <div
      className={`rounded-xl p-5 text-center ${
        isPush
          ? "bg-emerald-50 border-2 border-emerald-400"
          : "bg-red-50 border-2 border-red-400"
      }`}
    >
      <div
        className={`inline-block px-6 py-2 rounded-full text-xl font-bold ${
          isPush
            ? "bg-emerald-500 text-white"
            : "bg-red-500 text-white"
        }`}
      >
        {isPush ? "押し" : "降り"}
      </div>
      <div className="mt-3">
        <span className="text-sm text-zinc-500">押しEV = </span>
        <span
          className={`text-2xl font-bold ${
            isPush ? "text-emerald-700" : "text-red-700"
          }`}
        >
          {result.pushEv > 0 ? "+" : ""}
          {result.pushEv.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
