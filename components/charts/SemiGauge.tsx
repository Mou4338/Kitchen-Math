import type { Tone } from "@/lib/calculations/utils";
import { toneFill } from "@/lib/utils/tone";
import { CHART } from "@/lib/utils/colors";

/** Half-circle gauge from 0 to `max` with a highlighted reference band. */
export function SemiGauge({ value, max = 100, bandFrom, bandTo, tone = "neutral", label, display }: { value: number | null; max?: number; bandFrom: number; bandTo: number; tone?: Tone; label: string; display: string }) {
  const W = 240, H = 140, cx = 120, cy = 120, r = 96, sw = 18;
  const angle = (v: number) => Math.PI * (1 - Math.max(0, Math.min(max, v)) / max);
  const pt = (v: number, rad = r) => [cx + rad * Math.cos(angle(v)), cy - rad * Math.sin(angle(v))] as const;
  const arc = (from: number, to: number) => {
    const [x1, y1] = pt(from);
    const [x2, y2] = pt(to);
    const large = ((to - from) / max) * 180 > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  };
  const v = value ?? 0;
  const [nx, ny] = pt(v, r - 26);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[280px]" role="img" aria-label={`${label}: ${display}`}>
      <path d={arc(0, max)} fill="none" stroke={CHART.wash} strokeWidth={sw} strokeLinecap="round" />
      <path d={arc(bandFrom, bandTo)} fill="none" stroke={CHART.good} strokeOpacity={0.35} strokeWidth={sw} />
      {value !== null ? <path d={arc(0, Math.max(0.01, v))} fill="none" stroke={toneFill[tone]} strokeWidth={6} strokeLinecap="round" /> : null}
      {value !== null ? <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={CHART.ink} strokeWidth={3} strokeLinecap="round" /> : null}
      <circle cx={cx} cy={cy} r={6} fill={CHART.ink} />
      <text x={cx - r} y={cy + 18} textAnchor="middle" className="fill-muted" style={{ fontSize: 10 }}>0%</text>
      <text x={cx + r} y={cy + 18} textAnchor="middle" className="fill-muted" style={{ fontSize: 10 }}>{max}%</text>
    </svg>
  );
}
