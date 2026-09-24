import type { ReactNode } from "react";
import type { CalculatorMeta } from "@/lib/content/calculators";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { EducationBlock, FaqBlock, FormulaBlock, RelatedCalculators } from "@/components/content/CalculatorContent";
import { CalculatorIcon } from "@/components/ui/CalculatorIcon";
import { JsonLd } from "@/components/ui/JsonLd";
import { HowToUse } from "./HowToUse";
import { calculatorAppSchema } from "@/lib/seo";

/**
 * Page structure for every calculator:
 * header → short explanation → inputs + live result → analysis → scenario → insights (children)
 * → formula → education → FAQ → related calculators.
 */
export function CalculatorPage({ meta, children }: { meta: CalculatorMeta; children: ReactNode }) {
  return (
    <div className="container pb-28 pt-6 lg:pb-8">
      <Breadcrumbs items={[{ name: "Restaurant tools", path: "/restaurant" }, { name: meta.shortTitle, path: `/restaurant/${meta.slug}` }]} />
      <header className="hero-glow relative mb-6 mt-5 overflow-hidden rounded-3xl border border-line bg-card px-5 py-7 shadow-card sm:px-8 sm:py-9">
        <div className="grid-dots pointer-events-none absolute inset-0 opacity-60" aria-hidden />
        <div className="relative flex max-w-3xl items-start gap-4">
          <span className="hidden h-14 w-14 shrink-0 place-items-center rounded-2xl bg-inverse text-accent-bright shadow-glow sm:grid">
            <CalculatorIcon name={meta.icon} className="h-7 w-7" />
          </span>
          <div>
            <p className="eyebrow text-accent-dark">Free calculator · no login</p>
            <h1 className="mt-1.5 text-3xl font-semibold leading-tight sm:text-[2.6rem]">{meta.title}</h1>
            <p className="mt-2 text-base leading-relaxed text-muted sm:text-lg">{meta.summary}</p>
          </div>
        </div>
      </header>
      <div className="flex flex-col gap-10">
        <HowToUse slug={meta.slug} steps={meta.howTo} />
        {children}
        <FormulaBlock c={meta} />
        <EducationBlock c={meta} />
        <FaqBlock faqs={meta.faqs} />
        <RelatedCalculators c={meta} />
      </div>
      <JsonLd data={calculatorAppSchema(meta)} />
    </div>
  );
}
