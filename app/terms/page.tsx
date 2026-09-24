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
        crumbs={[{ name: "Home", path: "/restaurant" }, { name: "Terms", path: "/terms" }]}
        compact
      />
    <article className="container max-w-3xl pb-16 pt-10">
      <div className="prose-km mt-8 space-y-6">
        <section>
          <h2 className="text-xl font-semibold">Estimates, not advice</h2>
          <p className="mt-2">{SITE.name} provides calculators for planning. Results depend on the numbers you enter and on simplified models. They are not financial, tax, investment or legal advice, and they are not a guarantee of any result.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">Reference benchmarks</h2>
          <p className="mt-2">Benchmarks and ranges are indicative only. The right figures for your business depend on format, location, cuisine and pricing.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">Your responsibility</h2>
          <p className="mt-2">You are responsible for decisions you make using these tools. Please check important decisions with a qualified professional.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">Availability</h2>
          <p className="mt-2">The service is provided free and &ldquo;as is&rdquo;. We may change or discontinue features at any time.</p>
        </section>
      </div>
    </article>
    </>
  );
}
