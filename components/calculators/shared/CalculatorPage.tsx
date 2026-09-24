import Link from "next/link";
import { ArrowDown, BookOpen } from "lucide-react";
import type { ReactNode } from "react";
import type { CalculatorMeta } from "@/lib/content/calculators";
import { PAGE_IMAGES } from "@/lib/content/images";
import { PageHero } from "@/components/layout/PageHero";
import { EducationBlock, FaqBlock, FormulaBlock, RelatedCalculators } from "@/components/content/CalculatorContent";
import { buttonClass } from "@/components/ui/Button";
import { JsonLd } from "@/components/ui/JsonLd";
import { calculatorAppSchema } from "@/lib/seo";
import { HowToUse } from "./HowToUse";

/** "Restaurant Health Calculator" → ["Restaurant Health", "Calculator"] */
function splitTitle(title: string): [string, string] {
  const i = title.lastIndexOf(" ");
  return i > 0 ? [title.slice(0, i), title.slice(i + 1)] : [title, ""];
}

/**
 * Page structure for every calculator:
 * photo banner → how to use → inputs + live result → analysis → scenario → insights (children)
 * → formula → education → FAQ → related calculators.
 */
export function CalculatorPage({ meta, children }: { meta: CalculatorMeta; children: ReactNode }) {
  const [title, accent] = splitTitle(meta.title);
  return (
    <>
      <PageHero
        photo={PAGE_IMAGES[meta.slug]}
        eyebrow={meta.isNew ? "New · free calculator" : "Free calculator · no login"}
        title={title}
        accent={accent}
        subtitle={meta.summary}
        crumbs={[{ name: "Home", path: "/" }, { name: "Tools", path: "/restaurant" }, { name: meta.shortTitle, path: `/restaurant/${meta.slug}` }]}
        compact
      >
        <div className="flex flex-wrap items-center gap-3">
          <a href="#calculator" className={buttonClass("accent", "lg")}>
            Start calculating <ArrowDown className="h-4 w-4" aria-hidden />
          </a>
          <Link href="/restaurant/help" className="inline-flex h-12 items-center gap-2 rounded-xl border border-on-inverse/30 px-5 font-medium text-on-inverse transition hover:bg-on-inverse/10">
            <BookOpen className="h-4 w-4" aria-hidden /> How to use
          </Link>
        </div>
        <ul className="mt-6 flex flex-wrap gap-2" aria-label="What you get">
          {meta.metrics.map((m) => (
            <li key={m} className="rounded-full border border-on-inverse/15 bg-on-inverse/10 px-3 py-1 text-xs font-medium text-on-inverse/85 backdrop-blur">{m}</li>
          ))}
        </ul>
      </PageHero>

      <div id="calculator" className="container scroll-mt-20 pb-28 pt-8 lg:pb-8">
        <div className="flex flex-col gap-10">
          <HowToUse slug={meta.slug} steps={meta.howTo} />
          {children}
          <FormulaBlock c={meta} />
          <EducationBlock c={meta} />
          <FaqBlock faqs={meta.faqs} />
          <RelatedCalculators c={meta} />
        </div>
      </div>
      <JsonLd data={calculatorAppSchema(meta)} />
    </>
  );
}
