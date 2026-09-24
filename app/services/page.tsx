import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calculator, Check } from "lucide-react";
import { ServiceIcon } from "@/components/company/ServiceIcon";
import { PageHero } from "@/components/layout/PageHero";
import { buttonClass } from "@/components/ui/Button";
import { JsonLd } from "@/components/ui/JsonLd";
import { Reveal } from "@/components/ui/Motion";
import { COMPANY_IMAGES, GLOSSARY, GROWTH_EQUATION, SERVICES } from "@/lib/content/company";
import { pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Restaurant Growth Services: Menu, Pricing, Ads, Funnel & Competitor Intelligence",
  description:
    "Our restaurant growth consulting framework: menu optimization, pricing & AOV, ads & discounting, funnel optimization, hyperlocal intelligence, reviews, competitor intelligence, operations and measurement.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <PageHero
        photo={COMPANY_IMAGES.servicesHero}
        eyebrow={SITE.company.division}
        title="A practical framework for"
        accent="restaurant growth"
        subtitle="Nine areas we review to find growth opportunities across menu, pricing, visibility, conversion, customers and competition."
        crumbs={[{ name: "Home", path: "/" }, { name: "Services", path: "/services" }]}
      >
        <div className="flex flex-wrap gap-3">
          <Link href="/#contact" className={buttonClass("accent", "lg")}>Book a free growth audit <ArrowRight className="h-4 w-4" aria-hidden /></Link>
          <Link href="/restaurant" className="inline-flex h-12 items-center gap-2 rounded-xl border border-on-inverse/30 px-5 font-medium text-on-inverse transition hover:bg-on-inverse/10"><Calculator className="h-4 w-4" aria-hidden /> Free tools</Link>
        </div>
      </PageHero>

      {/* Jump links */}
      <nav aria-label="Services" className="no-print sticky top-16 z-30 border-b border-line bg-paper/90 backdrop-blur">
        <div className="container flex gap-2 overflow-x-auto py-3 [scrollbar-width:none]">
          {SERVICES.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="shrink-0 rounded-full border border-line bg-card px-3.5 py-1.5 text-sm font-medium text-ink-soft transition hover:border-accent hover:text-accent">
              {s.number} {s.title}
            </a>
          ))}
        </div>
      </nav>

      <div className="container py-16 sm:py-20">
        <div className="flex flex-col gap-16 sm:gap-24">
          {SERVICES.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-36" aria-labelledby={`${s.id}-t`}>
              {i === 7 ? (
                <div className="mb-12 rounded-3xl bg-accent-soft p-6 text-center sm:p-8">
                  <p className="eyebrow text-accent-dark">Additional growth levers</p>
                  <p className="mt-2 text-lg font-semibold">Two areas that strengthen the framework without making it complicated.</p>
                </div>
              ) : null}
              <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                <Reveal className={i % 2 ? "lg:order-2" : ""}>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-inverse shadow-lift">
                    <Image src={s.image.src} alt={s.image.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover transition-transform duration-700 hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-inverse/60 to-transparent" aria-hidden />
                    <span className="absolute bottom-5 left-5 font-serif text-6xl italic text-on-inverse/90">{s.number}</span>
                  </div>
                </Reveal>
                <Reveal delay={0.1}>
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent text-accent-ink shadow-glow"><ServiceIcon name={s.icon} className="h-6 w-6" /></span>
                  <h2 id={`${s.id}-t`} className="mt-5 text-3xl font-bold sm:text-4xl">{s.title}</h2>
                  <p className="mt-3 text-lg text-muted">{s.summary}</p>
                  <ul className="mt-6 grid gap-3">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex gap-3 rounded-2xl border border-line bg-card p-3.5 text-sm leading-relaxed text-ink-soft shadow-card">
                        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent-soft text-accent-dark"><Check className="h-3.5 w-3.5" aria-hidden /></span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* Growth equation */}
      <section className="bg-inverse py-16 text-on-inverse sm:py-20">
        <div className="container text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-bright">The growth equation</p>
          <p className="mx-auto mt-5 flex max-w-4xl flex-wrap items-center justify-center gap-3 text-xl font-semibold sm:text-2xl">
            {GROWTH_EQUATION.map((g, i) => (
              <span key={g.term} className="flex items-center gap-3">
                <span className="rounded-2xl border border-on-inverse/20 bg-on-inverse/10 px-4 py-2 text-on-inverse">{g.term}</span>
                <span className="text-accent-bright">{i < GROWTH_EQUATION.length - 1 ? "×" : "="}</span>
              </span>
            ))}
            <span className="rounded-2xl bg-accent px-4 py-2 text-accent-ink">Sustainable growth</span>
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-on-inverse/75">We don&apos;t chase traffic for its own sake. We find the biggest constraint, take the right action, and measure the impact.</p>
        </div>
      </section>

      {/* Glossary */}
      <section className="container py-16 sm:py-20" aria-labelledby="terms">
        <h2 id="terms" className="text-3xl font-bold">Terms we use</h2>
        <dl className="mt-6 grid gap-x-8 divide-y divide-line rounded-3xl border border-line bg-card px-6 shadow-card md:grid-cols-2 md:divide-y-0">
          {GLOSSARY.map(([t, d]) => (
            <div key={t} className="py-4 md:border-b md:border-line">
              <dt className="font-semibold">{t}</dt>
              <dd className="mt-1 text-sm text-ink-soft">{d}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-12 flex flex-col items-start justify-between gap-6 rounded-3xl bg-gradient-to-br from-accent to-accent-dark p-8 text-accent-ink sm:flex-row sm:items-center sm:p-10">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Ready to find your biggest growth constraint?</h2>
            <p className="mt-2 opacity-90">Book a free growth audit, or start with our free calculators.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/#contact" className="inline-flex h-12 items-center gap-2 rounded-xl bg-accent-ink px-6 font-semibold text-accent transition hover:opacity-90">Book a free audit <ArrowRight className="h-4 w-4" aria-hidden /></Link>
            <Link href="/restaurant" className="inline-flex h-12 items-center rounded-xl border border-accent-ink/30 px-5 font-medium transition hover:bg-accent-ink/10">Free tools</Link>
          </div>
        </div>
      </section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Restaurant growth services",
          itemListElement: SERVICES.map((s, i) => ({ "@type": "ListItem", position: i + 1, name: s.title, url: `${SITE.url}/services#${s.id}` })),
        }}
      />
    </>
  );
}
