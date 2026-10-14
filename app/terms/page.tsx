import { pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { PageHero } from "@/components/layout/PageHero";
import { PAGE_IMAGES } from "@/lib/content/images";

export const metadata = pageMetadata({ title: "Terms of Use", description: `Terms for using ${SITE.name} calculators.`, path: "/terms" });

export default function TermsPage() {
  return (
    <>
      <PageHero
        photo={PAGE_IMAGES.terms}
        eyebrow="Legal"
        title="Terms of"
        accent="use"
        subtitle="Last updated: September 2026"
        crumbs={[{ name: "Home", path: "/" }, { name: "Terms", path: "/terms" }]}
        compact
      />
    <div className="section-warm"><article className="container max-w-3xl pb-16 pt-10">
      <div className="prose-km mt-8 space-y-4">
        <section className="card-glow rounded-3xl border border-line bg-card p-6 shadow-card">
          <h2 className="flex items-center gap-3 text-xl font-semibold"><span className="brand-gradient h-6 w-1.5 shrink-0 rounded-full" aria-hidden />Estimates, not advice</h2>
          <p className="mt-2">{SITE.name} provides calculators for planning. Results depend on the numbers you enter and on simplified models. They are not financial, tax, investment or legal advice, and they are not a guarantee of any result.</p>
        </section>
        <section className="card-glow rounded-3xl border border-line bg-card p-6 shadow-card">
          <h2 className="flex items-center gap-3 text-xl font-semibold"><span className="brand-gradient h-6 w-1.5 shrink-0 rounded-full" aria-hidden />Reference benchmarks</h2>
          <p className="mt-2">Benchmarks and ranges are indicative only. The right figures for your business depend on format, location, cuisine and pricing.</p>
        </section>
        <section className="card-glow rounded-3xl border border-line bg-card p-6 shadow-card">
          <h2 className="flex items-center gap-3 text-xl font-semibold"><span className="brand-gradient h-6 w-1.5 shrink-0 rounded-full" aria-hidden />Your responsibility</h2>
          <p className="mt-2">You are responsible for decisions you make using these tools. Please check important decisions with a qualified professional.</p>
        </section>
        <section className="card-glow rounded-3xl border border-line bg-card p-6 shadow-card">
          <h2 className="flex items-center gap-3 text-xl font-semibold"><span className="brand-gradient h-6 w-1.5 shrink-0 rounded-full" aria-hidden />Availability</h2>
          <p className="mt-2">The service is provided free and &ldquo;as is&rdquo;. We may change or discontinue features at any time.</p>
        </section>
      </div>
    </article></div>
    </>
  );
}
