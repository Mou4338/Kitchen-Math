import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { PAGE_IMAGES } from "@/lib/content/images";
import { CalculatorIcon } from "@/components/ui/CalculatorIcon";
import { CALCULATORS } from "@/lib/content/calculators";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Restaurant Finance Guides: Food Cost, Break-Even, Prime Cost & More",
  description: "Short, practical guides to the numbers that decide restaurant profit, each linked to a free calculator.",
  path: "/restaurant/guides",
});

export default function GuidesPage() {
  return (
    <>
      <PageHero
        photo={PAGE_IMAGES.guides}
        eyebrow="Learn the numbers"
        title="Restaurant finance"
        accent="guides"
        subtitle="The key idea behind each calculator in two minutes, with a worked example you can check yourself."
        crumbs={[{ name: "Home", path: "/restaurant" }, { name: "Guides", path: "/restaurant/guides" }]}
      />
    <div className="container pb-16 pt-12">
      <div className="grid gap-5 md:grid-cols-2">
        {CALCULATORS.map((c) => (
          <article key={c.slug} className="flex flex-col rounded-2xl border border-line bg-card p-6 shadow-card">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-soft text-accent-dark"><CalculatorIcon name={c.icon} className="h-5 w-5" /></span>
              <h2 className="text-lg font-semibold">{c.shortTitle}</h2>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ink-soft">{c.education.what}</p>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft"><b>Why it matters:</b> {c.education.why}</p>
            <p className="tabular mt-3 rounded-xl bg-wash p-3 text-sm leading-relaxed text-ink-soft"><b>Example:</b> {c.education.example}</p>
            <Link href={`/restaurant/${c.slug}`} className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-accent-dark hover:underline">
              Open the {c.shortTitle.toLowerCase()} calculator <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </article>
        ))}
      </div>
    </div>
    </>
  );
}
