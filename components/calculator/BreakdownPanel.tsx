import type { EvInput, EvResult } from "@/lib/types";

const formatPlain = (n: number) => Math.abs(n).toLocaleString("ja-JP");
const formatSigned = (n: number) =>
  (n > 0 ? "+" : n < 0 ? "−" : "±") + Math.abs(n).toLocaleString("ja-JP");

export default function BreakdownPanel({
  input,
  result,
}: {
  input: EvInput;
  result: EvResult;
}) {
  const isPush = result.pushEv > 0;
  return (
    <div
      className="rounded-lg p-3 md:p-4 font-num text-[13px] leading-7"
      style={{
        background: "var(--c-bg)",
        border: "1px solid var(--c-border)",
      }}
    >
      <div>
        <span className="font-bold" style={{ color: "var(--c-push)" }}>
          +{formatPlain(result.winComponent)}
        </span>{" "}
        <span style={{ color: "var(--c-text-faint)" }}>
          ({input.winRate}% × {input.expectedScore.toLocaleString()})
        </span>
      </div>
      <div>
        <span className="font-bold" style={{ color: "var(--c-fold)" }}>
          −{formatPlain(result.loseComponent)}
        </span>{" "}
        <span style={{ color: "var(--c-text-faint)" }}>
          ({input.dealInRate}% × {input.opponentScore.toLocaleString()})
        </span>
      </div>
      {result.rankComponent !== 0 && (
        <div>
          <span
            className="font-bold"
            style={{
              color:
                result.rankComponent > 0
                  ? "var(--c-push)"
                  : "var(--c-fold)",
            }}
          >
            {formatSigned(result.rankComponent)}
          </span>{" "}
          <span style={{ color: "var(--c-text-faint)" }}>(順位補正)</span>
        </div>
      )}
      <div style={{ color: "var(--c-text-faint)" }}>━━━━━━━━━━━</div>
      <div
        className="font-bold"
        style={{
          color: isPush ? "var(--c-push)" : "var(--c-fold)",
          fontSize: "16px",
        }}
      >
        = {formatSigned(result.pushEv)}
      </div>
    </div>
  );
}
