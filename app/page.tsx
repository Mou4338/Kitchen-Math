import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, Calculator, Filter, Check, Mail, MapPin, MessageCircle, Phone, Repeat, ShoppingBag, Sparkles, TrendingUp, Users, X, Equal,
} from "lucide-react";
import { ContactForm } from "@/components/company/ContactForm";
import { ServiceCard } from "@/components/company/ServiceCard";
import { HeroPreview } from "@/components/dashboard/HeroPreview";
import { buttonClass } from "@/components/ui/Button";
import { CalculatorIcon } from "@/components/ui/CalculatorIcon";
import { JsonLd } from "@/components/ui/JsonLd";
import { Reveal } from "@/components/ui/Motion";
import { StatusPill } from "@/components/ui/StatusPill";
import { CALCULATORS } from "@/lib/content/calculators";
import { COMPANY_IMAGES, FUNNEL, GROWTH_EQUATION, PROCESS, PRODUCT_MATRIX, SERVICES } from "@/lib/content/company";
import { pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = pageMetadata({
  title: `${SITE.name}: Restaurant Growth Consulting & Free Restaurant Tools`,
  description:
    "Restaurant growth consulting for Indian restaurants and cloud kitchens: menu optimization, pricing & AOV, ads & discounting, funnel optimization, hyperlocal and competitor intelligence. Plus free profitability calculators.",
  path: "/",
  keywords: ["restaurant growth consulting", "restaurant consultant India", "swiggy zomato growth", "menu optimization", "restaurant AOV", "cloud kitchen consulting"],
});

const EQ_ICONS = [Users, ShoppingBag, TrendingUp, Repeat];
const TOOL_HIGHLIGHTS = ["restaurant-health-calculator", "break-even-calculator", "online-sale-payout-calculator", "menu-pricing-calculator", "menu-engineering-calculator", "profit-margin-calculator"] as const;

export default function CompanyHome() {
  const core = SERVICES.filter((s) => s.group === "core");
  const levers = SERVICES.filter((s) => s.group === "lever");
  const c = SITE.company;

  return (
    <>
      {/* 1 · HERO (deep navy) */}
      <section className="relative isolate overflow-hidden bg-inverse">
        <Image src={COMPANY_IMAGES.hero.src} alt={COMPANY_IMAGES.hero.alt} fill priority sizes="100vw" className="-z-10 object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-inverse via-inverse/90 to-inverse/40" aria-hidden />
        <div className="absolute inset-0 -z-10 bg-accent/15 mix-blend-color" aria-hidden />
        <div className="container grid items-center gap-12 py-20 sm:py-24 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:py-28">
          <Reveal className="text-on-inverse">
            <p className="inline-flex items-center gap-2 rounded-full border border-on-inverse/20 bg-on-inverse/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-accent-bright backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" aria-hidden /> {c.division}
            </p>
            <h1 className="mt-6 text-[2.6rem] font-semibold leading-[1.03] text-on-inverse sm:text-6xl lg:text-[4.2rem]">
              <span className="text-accent-bright">Grow your restaurant</span> <span className="font-serif font-normal italic">with clarity.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-on-inverse/80">
              We find the one thing holding your restaurant back across menu, pricing, visibility, conversion, customers and competition. Then we fix it and measure the impact.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="#contact" className={buttonClass("accent", "lg")}>Book a free growth audit <ArrowRight className="h-4 w-4" aria-hidden /></Link>
              <Link href="/restaurant" className="inline-flex h-12 items-center gap-2 rounded-xl border border-on-inverse/30 px-5 font-medium text-on-inverse transition hover:bg-on-inverse/10">
                <Calculator className="h-4 w-4" aria-hidden /> Try our free tools
              </Link>
            </div>
            <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-on-inverse/75">
              {["Delivery platforms", "Dine-in", "Cloud kitchens", "Cafés & QSR"].map((t) => (
                <li key={t} className="flex items-center gap-2"><Check className="h-4 w-4 text-accent-bright" aria-hidden /> {t}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="rounded-3xl border border-on-inverse/15 bg-on-inverse/10 p-6 text-on-inverse shadow-lift backdrop-blur-md sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-bright">The growth equation</p>
              <div className="mt-5 grid gap-3">
                {GROWTH_EQUATION.map((g, i) => {
                  const Icon = EQ_ICONS[i];
                  return (
                    <div key={g.term} className="flex items-center gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent text-accent-ink"><Icon className="h-5 w-5" aria-hidden /></span>
                      <span className="flex-1">
                        <span className="block font-semibold text-on-inverse">{g.term}</span>
                        <span className="block text-xs text-on-inverse/65">{g.detail}</span>
                      </span>
                      {i < GROWTH_EQUATION.length - 1 ? <X className="h-4 w-4 text-on-inverse/50" aria-label="times" /> : <Equal className="h-4 w-4 text-on-inverse/50" aria-label="equals" />}
                    </div>
                  );
                })}
              </div>
              <div className="mt-5 rounded-2xl bg-accent px-4 py-3 text-center font-semibold text-accent-ink">Sustainable restaurant growth</div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 2 · GROWTH EQUATION BAND (light blue) */}
      <section className="bg-accent-soft py-14 sm:py-16">
        <div className="container">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="font-serif text-2xl italic leading-snug text-ink sm:text-3xl">
              &ldquo;The objective is not simply to generate more traffic. It is to identify the biggest growth constraint, take the right action, and measure the impact.&rdquo;
            </p>
            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.14em] text-accent-dark">Our approach</p>
          </Reveal>
        </div>
      </section>

      {/* 3 · WHO WE ARE (white) */}
      <section className="container py-16 sm:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="relative mx-auto aspect-[5/4] w-full max-w-[560px]">
              <div className="absolute inset-0 overflow-hidden rounded-3xl bg-inverse shadow-lift">
                <Image src={COMPANY_IMAGES.team.src} alt={COMPANY_IMAGES.team.alt} fill sizes="(min-width: 1024px) 560px, 90vw" className="object-cover" />
                <div className="absolute inset-0 bg-accent/20 mix-blend-color" aria-hidden />
              </div>
              <div className="absolute -bottom-8 -right-2 aspect-square w-[42%] overflow-hidden rounded-3xl border-4 border-paper shadow-lift sm:-right-6">
                <Image src={COMPANY_IMAGES.dish.src} alt={COMPANY_IMAGES.dish.alt} fill sizes="240px" className="object-cover" />
              </div>
              <div className="absolute -left-2 top-6 rounded-2xl border border-line bg-card px-4 py-3 shadow-lift sm:-left-6">
                <p className="eyebrow">Framework</p>
                <p className="text-2xl font-bold text-accent">9 levers</p>
                <p className="text-xs text-muted">7 core + 2 growth levers</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-4xl font-bold leading-tight sm:text-5xl">
              <span className="block text-accent">Welcome to</span>
              <span className="block">{SITE.name}</span>
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-ink-soft">
              <b className="font-semibold text-ink">{SITE.name}</b> is a restaurant growth consultancy. We work with restaurants, cafés and cloud kitchens to find practical growth opportunities across the menu, pricing, visibility, conversion, customers and competition.
            </p>
            <p className="mt-4 leading-relaxed text-muted">
              Instead of generic advice, we use a clear framework: measure where orders are lost, rank every opportunity by its potential impact, turn insights into specific actions and experiments, and track the results in orders, conversion, AOV and revenue.
            </p>
            <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
              {["Menu & pricing that sell", "Ads that pay back", "Fewer funnel drop-offs", "Know your local market", "Better ratings, fewer complaints", "Clear, measured results"].map((p) => (
                <li key={p} className="flex items-center gap-2.5 text-sm font-medium">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-accent text-accent-ink"><Check className="h-3.5 w-3.5" aria-hidden /></span>
                  {p}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/services" className={buttonClass("accent", "lg")}>Explore our services <ArrowRight className="h-4 w-4" aria-hidden /></Link>
              <Link href="#contact" className={buttonClass("outline", "lg")}>Talk to us</Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 4 · SERVICES (pale blue) */}
      <section id="services" className="scroll-mt-20 bg-wash py-16 sm:py-24">
        <div className="container">
          <Reveal className="mx-auto mb-12 max-w-2xl text-center">
            <p className="eyebrow text-accent-dark">What we do</p>
            <h2 className="mt-2 text-4xl font-bold sm:text-5xl">Our <span className="text-accent">Services</span></h2>
            <p className="mt-4 text-muted">A practical framework that covers every part of how a restaurant wins, and loses, orders.</p>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {core.map((s, i) => (
              <Reveal key={s.id} delay={(i % 3) * 0.06}>
                <ServiceCard s={s} />
              </Reveal>
            ))}
            <Reveal delay={0.06} className="flex">
              <div className="flex w-full flex-col justify-center rounded-3xl bg-gradient-to-br from-accent to-accent-dark p-8 text-accent-ink shadow-glow">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] opacity-80">Plus two growth levers</p>
                <p className="mt-3 text-2xl font-bold">Operations & Availability · Measurement & Execution</p>
                <p className="mt-3 text-sm opacity-85">Growth only lasts if the kitchen can deliver it and every change is measured.</p>
                <Link href="/services#operations-availability" className="mt-6 inline-flex items-center gap-1.5 font-semibold">See how <ArrowRight className="h-4 w-4" aria-hidden /></Link>
              </div>
            </Reveal>
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {levers.map((s, i) => (
              <Reveal key={s.id} delay={i * 0.06}>
                <ServiceCard s={s} wide />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5 · HOW WE WORK (deep navy) */}
      <section className="relative overflow-hidden bg-inverse py-16 text-on-inverse sm:py-24">
        <div className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-accent/25 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-accent-bright/15 blur-3xl" aria-hidden />
        <div className="container relative">
          <Reveal className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-bright">How we work</p>
            <h2 className="mt-2 text-4xl font-bold text-on-inverse sm:text-5xl">From insight to <span className="font-serif font-normal italic text-accent-bright">impact</span></h2>
          </Reveal>
          <ol className="grid gap-5 md:grid-cols-4">
            {PROCESS.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <li className="relative h-full rounded-3xl border border-on-inverse/15 bg-on-inverse/5 p-6 backdrop-blur transition hover:-translate-y-1 hover:bg-on-inverse/10">
                  <span className="font-serif text-5xl italic text-accent-bright">0{i + 1}</span>
                  <h3 className="mt-3 text-xl font-semibold text-on-inverse">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-on-inverse/75">{p.body}</p>
                  {i < PROCESS.length - 1 ? <ArrowRight className="absolute -right-4 top-1/2 hidden h-6 w-6 -translate-y-1/2 text-accent-bright md:block" aria-hidden /> : null}
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* 6 · FRAMEWORKS IN ACTION (white) */}
      <section className="container py-16 sm:py-24">
        <Reveal className="mx-auto mb-12 max-w-2xl text-center">
          <p className="eyebrow text-accent-dark">Frameworks in action</p>
          <h2 className="mt-2 text-4xl font-bold sm:text-5xl">We measure what <span className="text-accent">matters</span></h2>
        </Reveal>
        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-3xl border border-line bg-card p-6 shadow-card sm:p-8">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-soft text-accent-dark"><Filter className="h-5 w-5" aria-hidden /></span>
                <h3 className="text-xl font-bold">The ordering funnel</h3>
              </div>
              <p className="mt-2 text-sm text-muted">Where do customers drop off between seeing you and ordering? We compare each stage across mealtimes and fix the weakest one first.</p>
              <ol className="mt-6 grid gap-3">
                {FUNNEL.map((f, i) => (
                  <li key={f.code} className="flex items-center gap-4">
                    <span
                      className="grid h-12 shrink-0 place-items-center rounded-xl bg-accent font-bold text-accent-ink"
                      style={{ width: `${100 - i * 14}%`, maxWidth: `${9 - i * 1.2}rem`, minWidth: "4.5rem", opacity: 1 - i * 0.15 }}
                    >
                      {f.code}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold">{f.name}</span>
                      <span className="block text-xs text-muted">{f.body}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="h-full rounded-3xl border border-line bg-card p-6 shadow-card sm:p-8">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-soft text-accent-dark"><TrendingUp className="h-5 w-5" aria-hidden /></span>
                <h3 className="text-xl font-bold">Dish performance matrix</h3>
              </div>
              <p className="mt-2 text-sm text-muted">Sales and ratings together tell us what to do with every dish on the menu.</p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {PRODUCT_MATRIX.map((m) => (
                  <div key={m.action} className="rounded-2xl border border-line bg-paper p-4 transition hover:-translate-y-0.5 hover:shadow-card">
                    <StatusPill tone={m.tone}>{m.action}</StatusPill>
                    <p className="mt-3 text-sm font-medium text-ink-soft">{m.when}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-muted">Plus: recurring complaints and patterns from customer reviews.</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 7 · FREE TOOLS PROMO (bright blue) */}
      <section className="relative overflow-hidden bg-gradient-to-br from-accent via-accent to-accent-dark py-16 text-accent-ink sm:py-24">
        <div className="grid-dots pointer-events-none absolute inset-0 opacity-20" aria-hidden />
        <div className="container relative grid items-center gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] opacity-80">Free for every restaurant owner</p>
            <h2 className="mt-2 text-4xl font-bold sm:text-5xl">Try our free <span className="font-serif font-normal italic">restaurant tools</span></h2>
            <p className="mt-4 max-w-xl text-lg opacity-90">Nine calculators that answer the questions we ask in every audit, in rupees and in seconds. No login, and your numbers never leave your device.</p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {TOOL_HIGHLIGHTS.map((slug) => {
                const t = CALCULATORS.find((x) => x.slug === slug)!;
                return (
                  <li key={slug}>
                    <Link href={`/restaurant/${slug}`} className="group flex items-center gap-3 rounded-2xl bg-accent-ink/10 p-3 transition hover:bg-accent-ink/20">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent-ink text-accent"><CalculatorIcon name={t.icon} className="h-5 w-5" /></span>
                      <span className="min-w-0">
                        <span className="block font-semibold">{t.shortTitle}</span>
                        <span className="block truncate text-xs opacity-80">{t.metrics.slice(0, 2).join(" · ")}</span>
                      </span>
                      <ArrowRight className="ml-auto h-4 w-4 shrink-0 opacity-70 transition-transform group-hover:translate-x-1" aria-hidden />
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/restaurant" className="inline-flex h-12 items-center gap-2 rounded-xl bg-accent-ink px-6 font-semibold text-accent transition hover:opacity-90">
                Open all 9 free tools <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link href="/restaurant/help" className="inline-flex h-12 items-center rounded-xl border border-accent-ink/30 px-5 font-medium transition hover:bg-accent-ink/10">How the tools work</Link>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mx-auto max-w-[420px] rotate-1 transition-transform duration-500 hover:rotate-0">
              <HeroPreview />
            </div>
          </Reveal>
        </div>
      </section>

      {/* 8 · CONTACT (light blue + photo) */}
      <section id="contact" className="scroll-mt-20 bg-accent-soft py-16 sm:py-24">
        <div className="container grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <Reveal>
            <div className="relative h-full min-h-[380px] overflow-hidden rounded-3xl bg-inverse text-on-inverse shadow-lift">
              <Image src={COMPANY_IMAGES.contact.src} alt={COMPANY_IMAGES.contact.alt} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-inverse via-inverse/70 to-inverse/20" aria-hidden />
              <div className="relative flex h-full flex-col justify-end p-6 sm:p-8">
                <h2 className="text-3xl font-bold text-on-inverse sm:text-4xl">Book a free <span className="font-serif font-normal italic text-accent-bright">growth audit</span></h2>
                <p className="mt-3 text-on-inverse/80">Tell us about your restaurant. We&apos;ll look for your biggest growth constraint and suggest where to start.</p>
                <ul className="mt-6 grid gap-3 text-sm">
                  <li className="flex items-center gap-3"><Mail className="h-4 w-4 text-accent-bright" aria-hidden /><a href={`mailto:${c.email}`} className="hover:underline">{c.email}</a></li>
                  {c.phone ? <li className="flex items-center gap-3"><Phone className="h-4 w-4 text-accent-bright" aria-hidden /><a href={`tel:${c.phone.replace(/\s/g, "")}`} className="hover:underline">{c.phone}</a></li> : null}
                  {c.whatsapp ? <li className="flex items-center gap-3"><MessageCircle className="h-4 w-4 text-accent-bright" aria-hidden /><a href={`https://wa.me/${c.whatsapp}`} target="_blank" rel="noopener noreferrer" className="hover:underline">Chat on WhatsApp</a></li> : null}
                  {c.location ? <li className="flex items-center gap-3"><MapPin className="h-4 w-4 text-accent-bright" aria-hidden />{c.location}</li> : null}
                </ul>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-3xl border border-line bg-card p-6 shadow-card sm:p-8">
              <h3 className="text-2xl font-bold">Tell us about your restaurant</h3>
              <p className="mt-1 text-sm text-muted">Takes about a minute. We reply by email.</p>
              <div className="mt-6"><ContactForm /></div>
            </div>
          </Reveal>
        </div>
      </section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: SITE.name,
          description: "Restaurant growth consulting: menu optimization, pricing & AOV, ads & discounting, funnel optimization, hyperlocal and competitor intelligence.",
          url: SITE.url,
          email: c.email,
          ...(c.phone ? { telephone: c.phone } : {}),
          areaServed: "IN",
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Restaurant growth services",
            itemListElement: SERVICES.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.title, description: s.summary } })),
          },
        }}
      />
    </>
  );
}
