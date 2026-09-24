import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { CalculatorMeta } from "@/lib/content/calculators";
import { CalculatorIcon } from "@/components/ui/CalculatorIcon";

export function CalculatorCard({ c, compact, variant = "default" }: { c: CalculatorMeta; compact?: boolean; variant?: "default" | "service" }) {
  if (variant === "service") {
    return (
      <Link
        href={`/restaurant/${c.slug}`}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lift"
      >
        <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100" aria-hidden />
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent text-accent-ink shadow-glow transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
          <CalculatorIcon name={c.icon} className="h-6 w-6" />
        </span>
        <h3 className="mt-5 flex items-center gap-2 text-lg font-bold">
          {c.title}
          {c.isNew ? <span className="rounded-full bg-sage-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-sage-dark">New</span> : null}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{c.cardDescription}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-accent">
          Read more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
        </span>
      </Link>
    );
  }
  return (
    <Link
      href={`/restaurant/${c.slug}`}
      className="group relative flex h-full flex-col gap-4 rounded-2xl border border-line bg-card p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-lift"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent-soft text-accent-dark transition-colors group-hover:bg-accent group-hover:text-accent-ink">
          <CalculatorIcon name={c.icon} className="h-5 w-5" />
        </span>
        {c.isNew ? <span className="rounded-full bg-sage-soft px-2 py-0.5 text-[11px] font-semibold text-sage-dark">New</span> : null}
      </div>
      <div>
        <h3 className="text-[17px] font-semibold">{c.title}</h3>
        {!compact ? <p className="mt-1.5 text-sm leading-relaxed text-muted">{c.cardDescription}</p> : null}
      </div>
      {!compact ? (
        <ul className="flex flex-wrap gap-1.5" aria-label="Key metrics">
          {c.metrics.map((m) => (
            <li key={m} className="rounded-md bg-wash px-2 py-1 text-[11px] font-medium text-ink-soft">{m}</li>
          ))}
        </ul>
      ) : null}
      <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-accent-dark">
        Open calculator <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
      </span>
    </Link>
  );
}
