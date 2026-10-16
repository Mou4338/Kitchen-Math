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
  title: "Restaurant Growth Services: Menu, Pricing, Ads, Conversion, Ratings & Competitors",
  description:
    "Six restaurant growth services: menu optimization, pricing & order value, ads & discounts, conversion (funnel), ratings & dish performance, and local market & competitors.",
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
        subtitle="Six services that find growth across your menu, prices, ads, conversion, ratings and local market."
        crumbs={[{ name: "Home", path: "/" }, { name: "Services", path: "/services" }]}
      >
        <div className="flex flex-wrap gap-3">
          <Link href="/#contact" className={buttonClass("accent", "lg")}>Book a free growth audit <ArrowRight className="h-4 w-4" aria-hidden /></Link>
          <Link href="/restaurant" className="btn-glass"><Calculator className="h-4 w-4" aria-hidden /> Free tools</Link>
        </div>
      </PageHero>

      {/* Jump links */}
      <nav aria-label="Services" className="no-print sticky top-16 z-30 border-b border-line bg-paper/90 backdrop-blur">
        <div className="container flex gap-2 overflow-x-auto py-3 [scrollbar-width:none]">
          {SERVICES.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="shrink-0 rounded-full border border-line bg-card px-3.5 py-1.5 text-sm font-medium text-ink-soft transition hover:border-star/60 hover:text-star-dark">
              {s.number} {s.title}
            </a>
          ))}
        </div>
      </nav>

      <div className="container py-16 sm:py-20">
        <div className="flex flex-col gap-16 sm:gap-24">
          {SERVICES.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-36" aria-labelledby={`${s.id}-t`}>
              <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                <Reveal className={i % 2 ? "lg:order-2" : ""}>
                  <div className={`relative aspect-[4/3] overflow-hidden rounded-3xl shadow-lift ${s.image.src.startsWith("/") ? "border border-line bg-[#FBF6F2]" : "bg-inverse"}`}>
                    <Image src={s.image.src} alt={s.image.alt} fill unoptimized={s.image.src.startsWith("/")} sizes="(min-width: 1024px) 50vw, 100vw" className={`object-cover transition-transform duration-700 ${s.image.src.startsWith("/") ? "hover:scale-[1.02]" : "hover:scale-105"}`} />
                    {!s.image.src.startsWith("/") && <div className="absolute inset-0 bg-gradient-to-t from-inverse/60 to-transparent" aria-hidden />}
                    <span className="brand-gradient-text absolute bottom-5 left-5 font-serif text-6xl italic">{s.number}</span>
                  </div>
                </Reveal>
                <Reveal delay={0.1}>
                  <span className="brand-gradient grid h-12 w-12 place-items-center rounded-xl text-accent-ink shadow-glow"><ServiceIcon name={s.icon} className="h-6 w-6" /></span>
                  <h2 id={`${s.id}-t`} className="mt-5 text-3xl font-bold sm:text-4xl">{s.title}</h2>
                  <p className="mt-3 text-lg text-muted">{s.summary}</p>
                  <ul className="mt-6 grid gap-3">
                    {s.bullets.map((b) => (
                      <li key={b} className="card-glow flex gap-3 rounded-2xl border border-line bg-card p-3.5 text-sm leading-relaxed text-ink-soft shadow-card">
                        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-star text-star-ink"><Check className="h-3.5 w-3.5" aria-hidden /></span>
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
      <section className="panel-band py-16 sm:py-20">
        <div className="container text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-star-text">The growth equation</p>
          <p className="mx-auto mt-5 flex max-w-4xl flex-wrap items-center justify-center gap-3 text-xl font-semibold sm:text-2xl">
            {GROWTH_EQUATION.map((g, i) => (
              <span key={g.term} className="flex items-center gap-3">
                <span className="rounded-2xl bg-[#F2F1EC] px-4 py-2 text-[#0A090B] shadow-[0_8px_18px_-10px_rgb(0_0_0/0.7)]">{g.term}</span>
                <span className="text-star-text">{i < GROWTH_EQUATION.length - 1 ? "×" : "="}</span>
              </span>
            ))}
            <span className="brand-gradient rounded-2xl px-4 py-2 text-accent-ink shadow-[0_12px_26px_-14px_rgb(0_0_0/0.7)] [text-shadow:0_1px_2px_rgb(0_0_0/0.25)]">Sustainable growth</span>
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-on-inverse/75">We don&apos;t chase traffic for its own sake. We find the biggest constraint, take the right action, and measure the impact.</p>
        </div>
      </section>

      {/* Glossary */}
      <section className="py-16 sm:py-20" aria-labelledby="terms">
       <div className="container">
        <p className="eyebrow text-star-dark">Glossary</p>
        <h2 id="terms" className="mt-2 text-3xl font-bold">Terms we <span className="text-accent">use</span></h2>
        <dl className="mt-6 grid gap-x-8 divide-y divide-line rounded-3xl border border-line bg-card px-6 shadow-lift md:grid-cols-2 md:divide-y-0">
          {GLOSSARY.map(([t, d]) => (
            <div key={t} className="py-4 md:border-b md:border-line">
              <dt className="font-semibold">{t}</dt>
              <dd className="mt-1 text-sm text-ink-soft">{d}</dd>
            </div>
          ))}
        </dl>
        <div className="panel-red mt-12 flex flex-col items-start justify-between gap-6 rounded-3xl p-8 shadow-lift sm:flex-row sm:items-center sm:p-10">
          <div>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Ready to find your biggest <span className="font-serif font-normal italic">growth constraint?</span></h2>
            <p className="mt-2 opacity-90">Book a free growth audit, or start with our free calculators.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/#contact" className="btn-white">Book a free audit <ArrowRight className="h-4 w-4" aria-hidden /></Link>
            <Link href="/growth-scorecard" className="glass-card glass-card-hover inline-flex h-12 items-center rounded-xl px-5 font-medium text-white">Take the scorecard</Link>
          </div>
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
