import type { Tone } from "@/lib/calculations/utils";
import { toneFill } from "@/lib/utils/tone";
import { CHART } from "@/lib/utils/colors";

/** Circular progress ring (0–100). */
export function CircularScore({ value, tone = "neutral", size = 120, stroke = 10, label, center }: { value: number | null; tone?: Tone; size?: number; stroke?: number; label: string; center?: string }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const v = value === null ? 0 : Math.max(0, Math.min(100, value));
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${label}: ${value === null ? "not available" : Math.round(v)}`} className="shrink-0">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={CHART.wash} strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={toneFill[tone]}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - v / 100)}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset .5s ease" }}
      />
      <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" className="fill-ink font-bold" style={{ fontSize: size * 0.26, fontVariantNumeric: "tabular-nums" }}>
        {center ?? (value === null ? "—" : Math.round(v))}
      </text>
    </svg>
  );
}
