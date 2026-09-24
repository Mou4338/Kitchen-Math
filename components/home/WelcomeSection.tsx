import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { buttonClass } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Motion";
import { WELCOME_PHOTO } from "@/lib/content/images";
import { SITE } from "@/lib/site";

const POINTS = ["Dine-in restaurants", "Cloud kitchens", "Cafés & bakeries", "QSR outlets", "Bars & lounges", "Small chains"];

/** "Welcome to …" block: text on the left, blob-shaped duotone photo on the right. */
export function WelcomeSection() {
  const photo = SITE.images.welcome ? { src: SITE.images.welcome, alt: "Our team at work" } : WELCOME_PHOTO;
  return (
    <section className="container py-16 sm:py-24">
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-16">
        <Reveal>
          <h2 className="text-4xl font-bold leading-tight sm:text-5xl">
            <span className="block text-accent">Welcome to</span>
            <span className="block">{SITE.name}</span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-ink-soft">
            <b className="font-semibold text-ink">{SITE.name}</b> is a free set of financial tools for restaurant owners across India. Work out food cost, labor, prime cost, break-even, delivery-app payouts, menu prices, ROI and menu performance in rupees, with every formula explained.
          </p>
          <p className="mt-4 leading-relaxed text-muted">
            Most restaurants don&apos;t fail on food; they fail on numbers. With net margins often just 5–10%, one unchecked point of food cost or one untracked discount can turn a good month into a loss. Our calculators show you where you stand and what to fix first.
          </p>
          <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
            {POINTS.map((p) => (
              <li key={p} className="flex items-center gap-2.5 text-sm font-medium">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-accent text-accent-ink"><Check className="h-3.5 w-3.5" aria-hidden /></span>
                {p}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/restaurant/about" className={buttonClass("accent", "lg")}>
              Read more <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link href="/restaurant/help" className={buttonClass("outline", "lg")}>How it works</Link>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative mx-auto aspect-[1/1.05] w-full max-w-[520px]">
            <div className="absolute -inset-3 rotate-[8deg] rounded-[62%_38%_55%_45%/48%_60%_40%_52%] bg-accent/15" aria-hidden />
            <div className="absolute inset-0 overflow-hidden rounded-[38%_62%_45%_55%/60%_40%_60%_40%] bg-inverse shadow-lift">
              <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 1024px) 520px, 90vw" className="object-cover" />
              {/* duotone tint like the reference: blue in light theme, gold in dark theme */}
              <div className="absolute inset-0 bg-accent/35 mix-blend-color" aria-hidden />
              <div className="absolute inset-0 bg-gradient-to-tr from-inverse/40 to-transparent" aria-hidden />
            </div>
            <div className="absolute -left-2 bottom-8 rounded-2xl border border-line bg-card px-4 py-3 shadow-lift sm:-left-6">
              <p className="eyebrow">Food cost</p>
              <p className="tabular text-2xl font-bold text-sage-dark">31.8%</p>
              <p className="text-xs text-muted">Example · within range</p>
            </div>
            <div className="absolute -right-2 top-8 rounded-2xl border border-line bg-card px-4 py-3 shadow-lift sm:-right-4">
              <p className="eyebrow">Health score</p>
              <p className="tabular text-2xl font-bold text-accent">91<span className="text-sm text-muted">/100</span></p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
