import Link from "next/link";
import { ArrowRight, Calculator, IndianRupee, Lock, UserX } from "lucide-react";
import { CalculatorCard } from "@/components/content/CalculatorCard";
import { HeroSlider } from "@/components/home/HeroSlider";
import { PhotoGallery } from "@/components/home/PhotoGallery";
import { PrivacyShield, StepAnalyze, StepEnter, StepSave } from "@/components/illustrations/Illustrations";
import { buttonClass } from "@/components/ui/Button";
import { JsonLd } from "@/components/ui/JsonLd";
import { Reveal } from "@/components/ui/Motion";
import { CALCULATORS } from "@/lib/content/calculators";
import { pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Restaurant Profitability Calculators for Indian Restaurant Owners",
  description: SITE.description,
  path: "/restaurant",
  keywords: ["restaurant calculators", "menu pricing calculator", "zomato payout calculator", "menu engineering", "restaurant tools India"],
});

const FACTS = [
  { Icon: Calculator, value: "3", label: "Free calculators" },
  { Icon: IndianRupee, value: "₹0", label: "Cost, forever" },
  { Icon: UserX, value: "0", label: "Logins or sign-ups" },
  { Icon: Lock, value: "100%", label: "Private: runs in your browser" },
];

const STEPS = [
  { Art: StepEnter, title: "Enter your numbers", body: "Every calculator opens with example figures and a short how-to. Replace them with yours from your books or POS." },
  { Art: StepAnalyze, title: "See where you stand", body: "Results update as you type, with reference ranges, clear colours and the rupee impact of each gap." },
  { Art: StepSave, title: "Test, save and share", body: "Try scenarios, save them on this device, and download a PDF or CSV for your partner or accountant." },
];

export default function RestaurantHome() {
  return (
    <>
      <HeroSlider />

      {/* Quick facts, overlapping the hero */}
      <div className="container relative z-10 -mt-10">
        <Reveal>
          <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line shadow-lift lg:grid-cols-4">
            {FACTS.map(({ Icon, value, label }) => (
              <li key={label} className="flex items-center gap-3 bg-card p-4 sm:p-5">
                <span className="icon-tile grid h-11 w-11 shrink-0 place-items-center rounded-xl"><Icon className="h-5 w-5" aria-hidden /></span>
                <span>
                  <span className="tabular block text-2xl font-bold leading-none">{value}</span>
                  <span className="mt-1 block text-xs text-muted sm:text-sm">{label}</span>
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>


      {/* Our calculators (services-style grid) */}
      <section id="tools" className="section-warm scroll-mt-20 py-16 sm:py-24">
        <div className="container">
          <Reveal className="mx-auto mb-12 max-w-2xl text-center">
            <p className="eyebrow text-star-dark">Free for every restaurant owner</p>
            <h2 className="mt-2 text-4xl font-bold sm:text-5xl">Our <span className="text-accent">Calculators</span></h2>
            <p className="mt-4 text-muted">Price every dish for profit, see what each online order really pays you, and find which dishes earn the most.</p>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CALCULATORS.map((c, i) => (
              <Reveal key={c.slug} delay={(i % 3) * 0.06}>
                <CalculatorCard c={c} variant="service" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 sm:py-24">
        <div className="container">
          <Reveal className="mx-auto mb-12 max-w-2xl text-center">
            <p className="eyebrow text-star-dark">How it works</p>
            <h2 className="mt-2 text-4xl font-bold">Three steps, <span className="text-accent">no training</span></h2>
            <p className="mt-3 text-muted">Enter your numbers, see where you stand, then test and share.</p>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            {STEPS.map(({ Art, title, body }, i) => (
              <Reveal key={title} delay={i * 0.08}>
                <div className="card-glow group h-full rounded-3xl border border-line bg-card p-6 shadow-card">
                  <Art className="mx-auto h-44 w-full max-w-[280px] transition-transform duration-500 group-hover:scale-[1.03]" />
                  <p className="mt-4 font-serif text-4xl italic leading-none text-star-dark">0{i + 1}</p>
                  <h3 className="mt-2 text-xl font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <PhotoGallery />

      {/* Call to action */}
      <section className="container pb-8">
        <Reveal>
          <div className="panel-band relative grid items-center gap-8 rounded-3xl p-8 shadow-lift sm:p-12 md:grid-cols-[1.3fr_1fr]">
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-accent/25 blur-3xl" aria-hidden />
            <div className="relative">
              <h2 className="text-3xl font-bold text-on-inverse sm:text-4xl">Private by design. <span className="font-serif font-normal italic text-accent-bright">Free forever.</span></h2>
              <p className="mt-4 max-w-lg leading-relaxed text-on-inverse/75">Calculations happen in your browser. Nothing you type is uploaded. Save scenarios on your device, share a link when you choose, and download PDF or CSV reports anytime.</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/restaurant/menu-pricing-calculator" className={buttonClass("accent", "lg")}>Get started free <ArrowRight className="h-4 w-4" aria-hidden /></Link>
                <Link href="/restaurant/help" className="btn-glass">How to use</Link>
              </div>
            </div>
            <PrivacyShield className="relative mx-auto w-full max-w-[300px]" />
          </div>
        </Reveal>
      </section>

      <JsonLd data={{ "@context": "https://schema.org", "@type": "WebSite", name: SITE.name, url: `${SITE.url}/restaurant`, description: SITE.description, inLanguage: "en-IN" }} />
    </>
  );
}
