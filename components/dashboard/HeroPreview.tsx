/**
 * Static, clearly-labelled example used in the tools promo.
 * Numbers match the worked example in the calculators: ₹130 total cost, 10% discount, 25% commission,
 * 5% ads, 5% GST on food, 20% margin → ₹309 menu price.
 */
const PAYOUT_LINES = [
  { label: "Discount", value: "−₹30.90" },
  { label: "Commission + 18% GST", value: "−₹82.04" },
  { label: "Customer GST", value: "+₹13.91" },
  { label: "Ads", value: "−₹14.60" },
];

const DISHES = [
  { name: "Chicken Biryani", tag: "Star", tone: "bg-sage-soft text-sage-dark", share: 100 },
  { name: "Paneer Butter Masala", tag: "Star", tone: "bg-sage-soft text-sage-dark", share: 66 },
  { name: "Tandoori Platter", tag: "Puzzle", tone: "bg-accent-soft text-accent-dark", share: 18 },
];

export function HeroPreview() {
  return (
    <div className="relative" aria-label="Example results from the three calculators" role="img">
      <div className="rounded-2xl border border-line bg-card p-4 text-ink shadow-lift sm:p-5">
        <div className="flex items-center justify-between gap-2 border-b border-line pb-3">
          <div>
            <p className="text-sm font-semibold">Chicken Biryani · Zomato</p>
            <p className="text-xs text-muted">Example numbers</p>
          </div>
          <span className="rounded-full bg-sage-soft px-2.5 py-1 text-xs font-semibold text-sage-dark">21.2% profit</span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-inverse p-3 text-on-inverse">
            <p className="text-[11px] font-medium uppercase tracking-wider text-on-inverse/60">Menu price</p>
            <p className="tabular mt-1 text-2xl font-bold">₹309</p>
            <p className="tabular mt-0.5 text-xs text-accent-bright">Break-even ₹205.61</p>
          </div>
          <div className="rounded-xl bg-wash/70 p-3">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted">You keep</p>
            <p className="tabular mt-1 text-2xl font-bold text-sage-dark">₹65.37</p>
            <p className="tabular mt-0.5 text-xs text-muted">Payout ₹195.37</p>
          </div>
        </div>
        <ul className="mt-3 divide-y divide-line rounded-xl border border-line px-3 text-sm">
          {PAYOUT_LINES.map((l) => (
            <li key={l.label} className="flex justify-between py-2"><span className="text-muted">{l.label}</span><span className="tabular font-medium">{l.value}</span></li>
          ))}
        </ul>
        <div className="mt-3 rounded-xl border border-line p-3">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted">Menu engineering</p>
          <ul className="mt-2 grid gap-2">
            {DISHES.map((d) => (
              <li key={d.name} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 text-sm">
                <span className="min-w-0">
                  <span className="block truncate font-medium">{d.name}</span>
                  <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-line"><span className="block h-full rounded-full bg-accent" style={{ width: `${d.share}%` }} /></span>
                </span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${d.tone}`}>{d.tag}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
