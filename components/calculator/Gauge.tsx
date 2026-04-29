export default function Gauge({ ev, push }: { ev: number; push: boolean }) {
  const size = 280;
  const cx = size / 2;
  const cy = size * 0.85;
  const r = size * 0.42;
  const clamped = Math.max(-8000, Math.min(8000, ev));
  const t = (clamped + 8000) / 16000;
  const ang = Math.PI * (1 - t);
  const tipX = cx + r * Math.cos(ang);
  const tipY = cy - r * Math.sin(ang);

  return (
    <svg
      width="100%"
      height="auto"
      viewBox={`0 0 ${size} ${size * 0.7}`}
      style={{ maxWidth: 320 }}
      role="img"
      aria-label={`Push EV gauge: ${ev}`}
    >
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx} ${cy - r}`}
        fill="none"
        stroke="var(--c-fold-bg)"
        strokeWidth="20"
      />
      <path
        d={`M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none"
        stroke="var(--c-push-bg)"
        strokeWidth="20"
      />
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none"
        stroke="var(--c-border)"
        strokeWidth="1"
      />
      <line
        x1={cx}
        y1={cy - r - 12}
        x2={cx}
        y2={cy - r + 12}
        stroke="var(--c-ink)"
        strokeWidth="2"
      />
      <line
        x1={cx}
        y1={cy}
        x2={tipX}
        y2={tipY}
        stroke={push ? "var(--c-push)" : "var(--c-fold)"}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx={cx} cy={cy} r="6" fill="var(--c-ink)" />
      <text
        x={cx - r}
        y={cy + 18}
        textAnchor="middle"
        fontFamily="var(--font-jetbrains-mono), monospace"
        fontSize="10"
        fill="var(--c-text-faint)"
      >
        −8k
      </text>
      <text
        x={cx}
        y={cy - r - 18}
        textAnchor="middle"
        fontFamily="var(--font-jetbrains-mono), monospace"
        fontSize="10"
        fill="var(--c-text-faint)"
      >
        0
      </text>
      <text
        x={cx + r}
        y={cy + 18}
        textAnchor="middle"
        fontFamily="var(--font-jetbrains-mono), monospace"
        fontSize="10"
        fill="var(--c-text-faint)"
      >
        +8k
      </text>
    </svg>
  );
}
