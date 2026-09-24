import { BookOpen, CircleCheck, TriangleAlert } from "lucide-react";
import type { CalculatorMeta } from "@/lib/content/calculators";
import { CALCULATORS } from "@/lib/content/calculators";
import { BENCHMARK_NOTE } from "@/lib/calculations/benchmarks";
import { JsonLd } from "@/components/ui/JsonLd";
import { faqSchema } from "@/lib/seo";
import { CalculatorCard } from "./CalculatorCard";

export function FormulaBlock({ c }: { c: CalculatorMeta }) {
  return (
    <section aria-labelledby="formula-title" className="print-break rounded-2xl border border-line bg-inverse p-6 text-on-inverse sm:p-8">
      <p className="eyebrow text-accent-bright">Formula</p>
      <h2 id="formula-title" className="mt-1 text-xl font-semibold text-on-inverse">How the numbers are calculated</h2>
      <dl className="mt-5 grid gap-4 sm:grid-cols-2">
        {c.formula.map((f) => (
          <div key={f.label} className="rounded-xl bg-on-inverse/5 p-4">
            <dt className="text-xs font-semibold uppercase tracking-wider text-on-inverse/60">{f.label}</dt>
            <dd className="mt-1.5 font-mono text-sm leading-relaxed text-on-inverse">{f.expression}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function EducationBlock({ c }: { c: CalculatorMeta }) {
  const e = c.education;
  return (
    <section aria-labelledby="learn-title" className="print-break">
      <p className="eyebrow text-accent-dark">Learn</p>
      <h2 id="learn-title" className="mt-1 text-2xl font-semibold">Understanding {c.shortTitle.toLowerCase()}</h2>
      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {[
          ["What is this?", e.what],
          ["How it works", e.how],
          ["Why it matters", e.why],
        ].map(([t, body]) => (
          <div key={t} className="rounded-2xl border border-line bg-card p-5">
            <h3 className="font-semibold">{t}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{body}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 rounded-2xl border border-line bg-accent-soft/60 p-5">
        <h3 className="flex items-center gap-2 font-semibold"><BookOpen className="h-4 w-4 text-accent-dark" aria-hidden /> Worked example</h3>
        <p className="tabular mt-2 text-sm leading-relaxed text-ink-soft">{e.example}</p>
      </div>
      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-line bg-card p-5">
          <h3 className="font-semibold">Common mistakes</h3>
          <ul className="mt-3 grid gap-2.5">
            {e.mistakes.map((m) => (
              <li key={m} className="flex gap-2.5 text-sm leading-relaxed text-ink-soft"><TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-caution" aria-hidden />{m}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-line bg-card p-5">
          <h3 className="font-semibold">Ways to improve</h3>
          <ul className="mt-3 grid gap-2.5">
            {e.improve.map((m) => (
              <li key={m} className="flex gap-2.5 text-sm leading-relaxed text-ink-soft"><CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-sage" aria-hidden />{m}</li>
            ))}
          </ul>
        </div>
      </div>
      <p className="mt-4 text-xs text-muted">{BENCHMARK_NOTE}</p>
    </section>
  );
}

export function FaqBlock({ faqs }: { faqs: { q: string; a: string }[] }) {
  return (
    <section aria-labelledby="faq-title" className="no-print">
      <h2 id="faq-title" className="text-2xl font-semibold">Frequently asked questions</h2>
      <div className="mt-5 divide-y divide-line rounded-2xl border border-line bg-card">
        {faqs.map((f) => (
          <details key={f.q} className="group px-5 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-4 py-4 font-medium">
              {f.q}
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-wash text-muted transition-transform group-open:rotate-45" aria-hidden>+</span>
            </summary>
            <p className="pb-5 text-sm leading-relaxed text-ink-soft">{f.a}</p>
          </details>
        ))}
      </div>
      <JsonLd data={faqSchema(faqs)} />
    </section>
  );
}

export function RelatedCalculators({ c }: { c: CalculatorMeta }) {
  const related = c.related.map((s) => CALCULATORS.find((x) => x.slug === s)).filter((x): x is CalculatorMeta => Boolean(x));
  return (
    <section aria-labelledby="related-title" className="no-print">
      <h2 id="related-title" className="text-2xl font-semibold">Related calculators</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((r) => (
          <CalculatorCard key={r.slug} c={r} />
        ))}
      </div>
    </section>
  );
}
