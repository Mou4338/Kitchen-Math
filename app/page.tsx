import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, Calculator, ClipboardCheck, Check, Mail, MapPin, MessageCircle, Phone, Repeat, ShoppingBag, Sparkles, TrendingUp, Users, X, Equal,
} from "lucide-react";
import { ContactForm } from "@/components/company/ContactForm";
import { HeroBackdrop } from "@/components/company/HeroBackdrop";
import { FaqBlock } from "@/components/content/CalculatorContent";
import { ServiceCard } from "@/components/company/ServiceCard";
import { HeroPreview } from "@/components/dashboard/HeroPreview";
import { buttonClass } from "@/components/ui/Button";
import { CalculatorIcon } from "@/components/ui/CalculatorIcon";
import { JsonLd } from "@/components/ui/JsonLd";
import { Reveal } from "@/components/ui/Motion";
import { CALCULATORS } from "@/lib/content/calculators";
import { COMPANY_IMAGES, GROWTH_EQUATION, PROCESS, SERVICES } from "@/lib/content/company";
import { pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = pageMetadata({
  title: `${SITE.name}: Restaurant Growth Consulting & Free Restaurant Tools`,
  description:
    "Restaurant growth consulting for Indian restaurants and cloud kitchens: menu optimization, pricing & order value, ads & discounts, conversion, ratings & dish performance, and local market & competitors. Plus free menu pricing, payout and menu engineering calculators.",
  path: "/",
  keywords: ["restaurant growth consulting", "restaurant consultant India", "swiggy zomato growth", "menu optimization", "restaurant AOV", "cloud kitchen consulting"],
});

const EQ_ICONS = [Users, ShoppingBag, TrendingUp, Repeat];
/** Ivory icon tiles (the logo's bowl colour) beside the four growth terms. */
const EQ_TILES = Array(4).fill("bg-[#F2F1EC] text-[#0A090B]");

export default function CompanyHome() {
  const c = SITE.company;

  return (
    <>
      {/* 1 · HERO (deep band) */}
      <section className="relative isolate overflow-hidden bg-inverse">
        <HeroBackdrop />
        {/* Royal overlay: deep band colour (black), lighter on the right so the room shows through */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-inverse via-inverse/75 to-inverse/20" aria-hidden />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-inverse/80 via-transparent to-inverse/35" aria-hidden />
        <div className="grid-lines grid-lines-inverse grid-fade absolute inset-0 -z-10 opacity-70" aria-hidden />
        <div className="absolute inset-0 -z-10 [background:radial-gradient(55%_70%_at_100%_0%,rgb(var(--hero-a)/0.18),transparent_70%)]" aria-hidden />
        <div className="absolute inset-0 -z-10 [background:radial-gradient(120%_80%_at_70%_40%,transparent_40%,rgb(var(--inverse)/0.55)_100%)]" aria-hidden />
        {/* Phones: text covers the full width, so darken the photo evenly for legibility */}
        <div className="absolute inset-0 -z-10 bg-inverse/45 lg:hidden" aria-hidden />
        <div className="container grid items-center gap-10 pb-16 pt-10 sm:gap-12 sm:py-24 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:py-28">
          <Reveal className="text-on-inverse">
            <p className="inline-flex max-w-full items-center gap-2 rounded-full border border-on-inverse/20 bg-on-inverse/10 px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-accent-bright backdrop-blur sm:px-3.5 sm:text-xs sm:tracking-[0.14em]">
              <Sparkles className="h-3.5 w-3.5 shrink-0 text-star-text" aria-hidden /> <span className="truncate">{c.division}</span>
            </p>
            <h1 className="mt-5 text-[2.25rem] font-semibold leading-[1.05] text-on-inverse [overflow-wrap:anywhere] min-[400px]:text-[2.6rem] sm:mt-6 sm:text-6xl sm:leading-[1.03] lg:text-[4.2rem]">
              <span className="text-accent-bright">Grow your restaurant</span> <span className="font-serif font-normal italic">with clarity.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-on-inverse/85 sm:mt-6 sm:text-lg">
              We find the one thing holding your restaurant back across menu, pricing, visibility, conversion, customers and competition. Then we fix it and measure the impact.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
              <Link href="#contact" className={buttonClass("accent", "lg", "w-full sm:w-auto")}>Book a free growth audit <ArrowRight className="h-4 w-4" aria-hidden /></Link>
              <Link href="/restaurant" className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-on-inverse/30 bg-inverse/30 px-5 font-medium text-on-inverse backdrop-blur transition hover:bg-on-inverse/10 sm:w-auto">
                <Calculator className="h-4 w-4" aria-hidden /> Try our free tools
              </Link>
            </div>
            <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-on-inverse/80 sm:mt-10 sm:flex sm:flex-wrap sm:gap-x-6">
              {["Delivery platforms", "Dine-in", "Cloud kitchens", "Cafés & QSR"].map((t) => (
                <li key={t} className="flex items-center gap-2"><Check className="h-4 w-4 text-star-text" aria-hidden /> {t}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="rounded-3xl border border-on-inverse/15 bg-on-inverse/10 p-5 text-on-inverse shadow-lift backdrop-blur-md sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-bright">The growth equation</p>
              <div className="mt-5 grid gap-3">
                {GROWTH_EQUATION.map((g, i) => {
                  const Icon = EQ_ICONS[i];
                  return (
                    <div key={g.term} className="flex items-center gap-3">
                      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ring-1 ring-[color:var(--tile-ring)] shadow-[0_8px_18px_-10px_rgb(var(--shade)/0.7)] ${EQ_TILES[i]}`}><Icon className="h-5 w-5" aria-hidden /></span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold text-on-inverse">{g.term}</span>
                        <span className="block text-xs text-on-inverse/65">{g.detail}</span>
                      </span>
                      {i < GROWTH_EQUATION.length - 1 ? <X className="h-4 w-4 text-on-inverse/50" aria-label="times" /> : <Equal className="h-4 w-4 text-on-inverse/50" aria-label="equals" />}
                    </div>
                  );
                })}
              </div>
              <div className="brand-gradient mt-5 rounded-2xl px-4 py-3 text-center font-semibold text-accent-ink shadow-[0_12px_26px_-14px_rgb(var(--shade)/0.7)] [text-shadow:0_1px_2px_rgb(var(--shade)/0.25)]">Sustainable restaurant growth</div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 2 · GROWTH EQUATION BAND (blush) */}
      <section className="relative isolate overflow-hidden bg-accent py-16 text-accent-ink sm:py-20">
        <div className="grid-lines absolute inset-0 -z-10 [--grid-a:0.14] [--grid-c:var(--accent-ink)]" aria-hidden />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[rgb(var(--shade)/0)] to-[rgb(var(--shade)/0.15)]" aria-hidden />
        <div className="container">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="font-serif text-2xl italic leading-snug text-accent-ink sm:text-[2rem]">
              &ldquo;The objective is not simply to generate more traffic. It is to identify the biggest growth constraint, take the right action, and measure the impact.&rdquo;
            </p>
            <p className="mt-5 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent-ink/85"><span className="h-0.5 w-8 rounded-full bg-star" aria-hidden />Our approach<span className="h-0.5 w-8 rounded-full bg-star" aria-hidden /></p>
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
                <div className="absolute inset-0 bg-gradient-to-t from-inverse/30 to-transparent" aria-hidden />
              </div>
              <div className="absolute -bottom-8 -right-2 aspect-square w-[42%] overflow-hidden rounded-3xl border-4 border-paper shadow-lift sm:-right-6">
                <Image src={COMPANY_IMAGES.dish.src} alt={COMPANY_IMAGES.dish.alt} fill sizes="240px" className="object-cover" />
              </div>
              <div className="absolute -left-2 top-6 rounded-2xl border border-line bg-card px-4 py-3 shadow-lift sm:-left-6">
                <p className="eyebrow">Framework</p>
                <p className="text-2xl font-bold text-accent">6 services</p>
                <p className="text-xs text-muted">Menu to local market</p>
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
              {["Menu & pricing that sell", "Ads that pay back", "Fewer funnel drop-offs", "Better ratings, fewer complaints", "Know your local market", "Beat your competitors"].map((p) => (
                <li key={p} className="flex items-center gap-2.5 text-sm font-medium">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-star text-star-ink"><Check className="h-3.5 w-3.5" aria-hidden /></span>
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

      {/* 4 · SERVICES (warm wash) */}
      <section id="services" className="relative isolate scroll-mt-20 overflow-hidden bg-wash py-16 sm:py-24">
        <div className="grid-lines grid-fade absolute inset-0 -z-10" aria-hidden />
        <div className="pointer-events-none absolute -right-32 -top-32 -z-10 h-96 w-96 rounded-full bg-accent/10 blur-3xl" aria-hidden />
        {/* Saffron glow falling from the top, with a fine saffron line on the top edge */}
        <div className="pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(65%_32%_at_50%_0%,rgb(var(--star)/0.22),transparent_75%)]" aria-hidden />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-[linear-gradient(90deg,transparent,rgb(var(--star))_30%,rgb(var(--star))_70%,transparent)] opacity-55" aria-hidden />
        <div className="container">
          <Reveal className="mx-auto mb-12 max-w-2xl text-center">
            <p className="eyebrow text-star-dark">What we do</p>
            <h2 className="mt-2 text-4xl font-bold sm:text-5xl">Our <span className="text-accent">Services</span></h2>
            <p className="mt-4 text-muted">A practical framework that covers every part of how a restaurant wins, and loses, orders.</p>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s, i) => (
              <Reveal key={s.id} delay={(i % 3) * 0.06}>
                <ServiceCard s={s} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5 · HOW WE WORK (deep band) */}
      <section className="band-sheen relative isolate overflow-hidden py-16 text-on-inverse sm:py-24">
        <Image src={COMPANY_IMAGES.kitchen.src} alt="" fill sizes="100vw" className="-z-10 object-cover opacity-[0.14] mix-blend-luminosity" aria-hidden />
        <div className="grid-lines grid-lines-inverse absolute inset-0 -z-10" aria-hidden />
        <div className="pointer-events-none absolute -left-24 top-10 -z-10 h-80 w-80 rounded-full bg-accent/20 blur-3xl" aria-hidden />
        <div className="container relative">
          <Reveal className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-star-text">How we work</p>
            <h2 className="mt-2 text-4xl font-bold text-on-inverse sm:text-5xl">From insight to <span className="font-serif font-normal italic text-accent-bright">impact</span></h2>
          </Reveal>
          <ol className="grid gap-5 md:grid-cols-4">
            {PROCESS.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <li className="relative h-full rounded-3xl border border-on-inverse/15 bg-on-inverse/5 p-6 backdrop-blur transition hover:-translate-y-1 hover:bg-on-inverse/10">
                  <span className="brand-gradient-text font-serif text-5xl italic">0{i + 1}</span>
                  <h3 className="mt-3 text-xl font-semibold text-on-inverse">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-on-inverse/75">{p.body}</p>
                  {i < PROCESS.length - 1 ? <ArrowRight className="absolute -right-4 top-1/2 hidden h-6 w-6 -translate-y-1/2 text-star-text md:block" aria-hidden /> : null}
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* 8 · SCORECARD CTA (blush) */}
      <section className="container pb-16 sm:pb-24">
        <Reveal>
          <div className="grid items-center gap-6 rounded-3xl border border-accent/25 bg-accent-soft p-6 sm:p-10 md:grid-cols-[auto_minmax(0,1fr)_auto]">
            <span className="brand-gradient grid h-16 w-16 place-items-center rounded-2xl text-accent-ink shadow-glow"><ClipboardCheck className="h-8 w-8" aria-hidden /></span>
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">Not sure where to start? Take the free <span className="accent-serif">Growth Scorecard</span></h2>
              <p className="mt-2 text-muted">12 quick questions, 2 minutes. Get a score for each of our 6 service areas and your top 3 priorities.</p>
            </div>
            <Link href="/growth-scorecard" className={buttonClass("accent", "lg")}>Start the scorecard <ArrowRight className="h-4 w-4" aria-hidden /></Link>
          </div>
        </Reveal>
      </section>

      {/* 9 · FREE TOOLS PROMO (red) */}
      <section className="tools-band relative isolate overflow-hidden bg-accent py-16 text-accent-ink sm:py-24">
        <div className="tb-fx absolute inset-0 -z-10 bg-gradient-to-br from-[rgb(var(--shade)/0)] via-[rgb(var(--shade)/0)] to-[rgb(var(--shade)/0.25)]" aria-hidden />
        <div className="grid-lines absolute inset-0 -z-10 [--grid-a:0.12] [--grid-c:var(--accent-ink)]" aria-hidden />
        {/* Soft light and shade blobs so the glass cards have something to blur */}
        <div className="tb-fx pointer-events-none absolute -left-20 top-1/4 -z-10 h-80 w-80 rounded-full bg-[rgb(var(--shade)/0.1)] blur-3xl" aria-hidden />
        <div className="tb-fx pointer-events-none absolute -bottom-24 right-1/4 -z-10 h-96 w-96 rounded-full bg-[rgb(var(--shade)/0.25)] blur-3xl" aria-hidden />
        {/* Saffron warmth: glow from the top-right corner, a softer one bottom-left */}
        <div className="pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(45%_60%_at_100%_0%,rgb(var(--star)/0.55),transparent_70%),radial-gradient(35%_45%_at_0%_100%,rgb(var(--star)/0.25),transparent_70%)]" aria-hidden />
        <div className="container relative grid items-center gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full bg-[rgb(var(--shade)/0.2)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em]"><span className="h-2 w-2 rounded-full bg-star" aria-hidden />Free for every restaurant owner</p>
            <h2 className="mt-3 text-4xl font-bold sm:text-5xl">Try our free <span className="relative inline-block font-serif font-normal italic">restaurant tools<span className="absolute inset-x-0 -bottom-1 h-1.5 rounded-full bg-star shadow-[0_4px_10px_-2px_rgb(var(--shade)/0.35)]" aria-hidden /></span></h2>
            <p className="mt-4 max-w-xl text-lg opacity-90">Three calculators that answer the questions we ask in every audit: what to charge, what you really keep on each order, and which dishes earn the most. No login, and your numbers never leave your device.</p>
            <ul className="mt-8 grid gap-3">
              {CALCULATORS.map((t) => {
                const slug = t.slug;
                return (
                  <li key={slug}>
                    <Link href={`/restaurant/${slug}`} className="glass-card glass-card-hover group flex items-center gap-4 rounded-2xl p-3.5 sm:p-4">
                      <span className="saffron-tile grid h-12 w-12 shrink-0 place-items-center rounded-xl text-accent shadow-[0_8px_18px_-8px_rgb(var(--shade)/0.55)]"><CalculatorIcon name={t.icon} className="h-5 w-5" /></span>
                      <span className="min-w-0">
                        <span className="block font-semibold">{t.shortTitle}</span>
                        <span className="block truncate text-xs opacity-85">{t.metrics.slice(0, 2).join(" · ")}</span>
                      </span>
                      <span className="ml-auto grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/20 bg-[rgb(var(--shade)/0.15)]"><ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden /></span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/restaurant" className="inline-flex h-12 items-center gap-2 rounded-xl bg-white px-6 font-semibold text-accent shadow-[0_14px_30px_-12px_rgb(var(--shade)/0.55)] transition hover:-translate-y-0.5">
                Open the free tools <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link href="/restaurant/help" className="glass-card glass-card-hover inline-flex h-12 items-center rounded-xl px-5 font-medium">How the tools work</Link>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="glass-card glass-frame mx-auto max-w-[440px] rotate-1 rounded-[28px] p-3 transition-transform duration-500 hover:rotate-0 sm:p-4">
              <HeroPreview />
            </div>
          </Reveal>
        </div>
      </section>

      {/* 10 · FAQ (white) */}
      <section className="container max-w-4xl py-16 sm:py-24">
        <FaqBlock
          faqs={[
            { q: "What kind of restaurants do you work with?", a: "Restaurants, cafés, QSR outlets and cloud kitchens: dine-in, delivery or both. The framework is built for food businesses that sell on delivery platforms as well as their own channels." },
            { q: "What do you look at in a growth audit?", a: "Six areas: your menu, pricing & order value, ads & discounts, conversion from listing view to order, ratings & dish performance, and your local market & competitors." },
            { q: "What information will you need from me?", a: "Typically your menu, recent sales by dish, delivery-platform funnel and ad reports, discount history and customer ratings. We'll tell you exactly what's useful for your situation." },
            { q: "How do you measure results?", a: "We agree the numbers up front (orders, conversion, average order value and revenue) and track them before and after each change." },
            { q: "How are the free tools related to your services?", a: "The calculators answer the same questions we ask in every audit: menu pricing, delivery payouts and profit, and menu engineering. Use them on your own anytime; your numbers stay on your device." },
          ]}
        />
      </section>

      {/* 11 · CONTACT: top-to-bottom fade, red → black */}
      <section id="contact" className="contact-fade relative isolate -mb-20 scroll-mt-20 overflow-hidden py-16 sm:py-24">
        <div className="grid-lines grid-lines-inverse absolute inset-0 -z-10" aria-hidden />
        <div className="container">
          <Reveal className="mx-auto mb-12 max-w-2xl text-center">
            <p className="eyebrow text-star-text">Get in touch</p>
            <h2 className="mt-2 text-4xl font-bold text-on-inverse sm:text-5xl">Book a free <span className="font-serif font-normal italic text-star-text">growth audit</span></h2>
            <p className="mt-4 text-on-inverse/80">Tell us about your restaurant. We&apos;ll look for your biggest growth constraint and suggest where to start.</p>
          </Reveal>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-10">
            <Reveal>
              <div className="red-edge-glow flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-card/85 backdrop-blur-xl">
                {/* Bright photo, only a light fade at the bottom edge so it stays vivid */}
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image src={COMPANY_IMAGES.contact.src} alt={COMPANY_IMAGES.contact.alt} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgb(var(--shade)/0.45)] via-transparent to-transparent" aria-hidden />
                  <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-[rgb(var(--shade)/0.55)] px-3.5 py-1.5 text-xs font-semibold text-[rgb(var(--shade-ink))] backdrop-blur">
                    <span className="h-2 w-2 rounded-full bg-star" aria-hidden /> Free · no obligation
                  </span>
                </div>
                <div className="p-6 sm:p-8">
                  <p className="eyebrow text-star-dark">How it works</p>
                  <ol className="mt-4 grid gap-4">
                    {[
                      ["Tell us about your restaurant", "Takes about a minute."],
                      ["We review your numbers", "Menu, pricing, ads, conversion, ratings and competitors."],
                      ["Get your starting point", "Your biggest growth constraint and what to fix first."],
                    ].map(([t, d], i) => (
                      <li key={t} className="flex gap-4">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line-strong bg-wash text-sm font-bold text-star-dark">{i + 1}</span>
                        <span><span className="block font-semibold">{t}</span><span className="block text-sm text-muted">{d}</span></span>
                      </li>
                    ))}
                  </ol>
                  <ul className="mt-6 grid gap-2 border-t border-line pt-6 text-sm">
                    <li><a href={`mailto:${c.email}`} className="flex items-center gap-3 rounded-xl px-2 py-2 text-ink-soft transition hover:bg-wash hover:text-ink"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-wash text-accent-dark"><Mail className="h-4 w-4" aria-hidden /></span>{c.email}</a></li>
                    {c.phone ? <li><a href={`tel:${c.phone.replace(/\s/g, "")}`} className="flex items-center gap-3 rounded-xl px-2 py-2 text-ink-soft transition hover:bg-wash hover:text-ink"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-wash text-accent-dark"><Phone className="h-4 w-4" aria-hidden /></span>{c.phone}</a></li> : null}
                    {c.whatsapp ? <li><a href={`https://wa.me/${c.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl px-2 py-2 text-ink-soft transition hover:bg-wash hover:text-ink"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-wash text-accent-dark"><MessageCircle className="h-4 w-4" aria-hidden /></span>Chat on WhatsApp</a></li> : null}
                    <li><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.address)}`} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 rounded-xl px-2 py-2 text-ink-soft transition hover:bg-wash hover:text-ink"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-wash text-accent-dark"><MapPin className="h-4 w-4" aria-hidden /></span><span className="pt-1.5 leading-relaxed">{c.address}</span></a></li>
                  </ul>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="red-edge-glow rounded-3xl border border-white/10 bg-card/85 p-6 backdrop-blur-xl sm:p-10">
                <h3 className="text-2xl font-bold">Tell us about your restaurant</h3>
                <p className="mt-1 text-sm text-muted">We reply by phone, WhatsApp or email.</p>
                <div className="mt-6 border-t border-line pt-6"><ContactForm /></div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: SITE.name,
          description: "Restaurant growth consulting: menu optimization, pricing & order value, ads & discounts, conversion, ratings & dish performance, and local market & competitors.",
          url: SITE.url,
          email: c.email,
          ...(c.phone ? { telephone: c.phone } : {}),
          areaServed: "IN",
          address: { "@type": "PostalAddress", streetAddress: "B Wing, 601 to 605, Raylon Arcade, Kondivita, J.B. Nagar, Andheri East", addressLocality: "Mumbai", addressRegion: "Maharashtra", postalCode: "400059", addressCountry: "IN" },
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
