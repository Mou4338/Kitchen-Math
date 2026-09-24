/** Static, clearly-labelled example dashboard used in the hero. */
const KPIS = [
  { label: "Food cost", value: "31.8%", ref: "≤ 35%", tone: "text-sage-dark", bar: 31.8 / 60 },
  { label: "Labor cost", value: "22.4%", ref: "20–25%", tone: "text-sage-dark", bar: 22.4 / 50 },
  { label: "Prime cost", value: "54.2%", ref: "55–65%", tone: "text-sage-dark", bar: 54.2 / 100 },
  { label: "Net margin", value: "11.6%", ref: "5–10%", tone: "text-sage-dark", bar: 11.6 / 20 },
];

const TREND = [182, 176, 190, 205, 198, 214, 226, 219, 238, 244, 251, 262];

export function HeroPreview() {
  const max = Math.max(...TREND);
  const min = Math.min(...TREND);
  const pts = TREND.map((v, i) => `${(i / (TREND.length - 1)) * 300},${70 - ((v - min) / (max - min)) * 60}`).join(" ");
  return (
    <div className="relative" aria-label="Example restaurant dashboard" role="img">
      <div className="absolute -inset-4 -z-10 rounded-[28px] bg-[radial-gradient(circle_at_70%_20%,rgba(217,119,11,0.14),transparent_60%)]" aria-hidden />
      <div className="rounded-2xl border border-line bg-card p-4 shadow-lift sm:p-5">
        <div className="flex items-center justify-between gap-2 border-b border-line pb-3">
          <div>
            <p className="text-sm font-semibold">Spice Route Kitchen · September</p>
            <p className="text-xs text-muted">Example dashboard</p>
          </div>
          <span className="rounded-full bg-sage-soft px-2.5 py-1 text-xs font-semibold text-sage-dark">Health 91/100</span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {KPIS.map((k) => (
            <div key={k.label} className="rounded-xl bg-wash/70 p-3">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted">{k.label}</p>
              <p className={`tabular mt-1 text-xl font-bold ${k.tone}`}>{k.value}</p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line"><div className="h-full rounded-full bg-sage" style={{ width: `${k.bar * 100}%` }} /></div>
              <p className="mt-1 text-[10px] text-muted">Reference {k.ref}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_1.3fr]">
          <div className="rounded-xl bg-inverse p-3 text-on-inverse">
            <p className="text-[11px] font-medium uppercase tracking-wider text-on-inverse/60">Break-even sales</p>
            <p className="tabular mt-1 text-xl font-bold">₹6,92,000</p>
            <p className="tabular mt-0.5 text-xs text-accent-bright">31% margin of safety</p>
          </div>
          <div className="rounded-xl border border-line p-3">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted">Monthly sales (₹K)</p>
            <svg viewBox="0 0 300 76" className="mt-1 h-14 w-full" preserveAspectRatio="none" aria-hidden>
              <polyline points={`0,76 ${pts} 300,76`} fill="rgb(var(--accent) / 0.14)" stroke="none" />
              <polyline points={pts} fill="none" stroke="rgb(var(--accent))" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
