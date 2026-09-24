"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Lock, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { HERO_SLIDES } from "@/lib/content/images";
import { buttonClass } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

/**
 * Full-width photo hero with 3 slides: arrows, dots, keyboard, swipe and autoplay.
 * Autoplay pauses on hover/focus and is off for visitors who prefer reduced motion.
 */
export function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [touchX, setTouchX] = useState<number | null>(null);
  const count = HERO_SLIDES.length;
  const go = (i: number) => setIndex((i + count) % count);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      setIndex((i) => (i + 1) % count);
    }, 7000);
    return () => window.clearInterval(id);
  }, [paused, count]);

  const slide = HERO_SLIDES[index];

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Highlights"
      className="relative isolate overflow-hidden bg-inverse"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") go(index - 1);
        if (e.key === "ArrowRight") go(index + 1);
      }}
      onTouchStart={(e) => setTouchX(e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX === null) return;
        const dx = e.changedTouches[0].clientX - touchX;
        if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
        setTouchX(null);
      }}
    >
      {/* Photos (cross-fade) */}
      {HERO_SLIDES.map((s, i) => (
        <div key={s.src} className={cn("absolute inset-0 -z-10 transition-opacity duration-1000", i === index ? "opacity-100" : "opacity-0")} aria-hidden={i !== index}>
          <Image src={s.src} alt={s.alt} fill priority={i === 0} sizes="100vw" className={cn("object-cover transition-transform duration-[7000ms] ease-out", i === index ? "scale-105" : "scale-100")} />
        </div>
      ))}
      {/* Brand overlay: navy/blue in light theme, black/gold in dark theme */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-inverse via-inverse/85 to-inverse/35" aria-hidden />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-inverse/70 via-transparent to-transparent" aria-hidden />
      <div className="absolute inset-0 -z-10 bg-accent/10 mix-blend-color" aria-hidden />

      <div className="container flex min-h-[540px] items-center py-16 sm:min-h-[600px] lg:min-h-[640px]">
        <div className="max-w-2xl text-on-inverse" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div key={index} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
              <p className="inline-flex items-center gap-2 rounded-full border border-on-inverse/20 bg-on-inverse/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-accent-bright backdrop-blur">
                {slide.eyebrow}
              </p>
              <h1 className="mt-5 text-[2.5rem] font-semibold leading-[1.05] text-on-inverse sm:text-6xl">
                <span className="text-accent-bright">{slide.title[0]}</span>{" "}
                <span className="font-serif font-normal italic">{slide.title[1]}</span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-on-inverse/80 sm:text-lg">{slide.text}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={slide.cta.href} className={buttonClass("accent", "lg")}>
                  {slide.cta.label} <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <Link href="#tools" className="inline-flex h-12 items-center rounded-xl border border-on-inverse/30 px-5 font-medium text-on-inverse transition hover:bg-on-inverse/10">
                  Explore all tools
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-on-inverse/75">
            <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-accent-bright" aria-hidden /> Free, no login</li>
            <li className="flex items-center gap-2"><Lock className="h-4 w-4 text-accent-bright" aria-hidden /> Numbers stay on your device</li>
          </ul>
        </div>
      </div>

      {/* Controls */}
      <button type="button" onClick={() => go(index - 1)} aria-label="Previous slide" className="absolute left-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-on-inverse/25 bg-on-inverse/10 text-on-inverse backdrop-blur transition hover:bg-on-inverse/20 md:grid">
        <ChevronLeft className="h-6 w-6" aria-hidden />
      </button>
      <button type="button" onClick={() => go(index + 1)} aria-label="Next slide" className="absolute right-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-on-inverse/25 bg-on-inverse/10 text-on-inverse backdrop-blur transition hover:bg-on-inverse/20 md:grid">
        <ChevronRight className="h-6 w-6" aria-hidden />
      </button>
      <div className="absolute inset-x-0 bottom-6 flex justify-center gap-2">
        {HERO_SLIDES.map((s, i) => (
          <button
            key={s.src}
            type="button"
            onClick={() => go(i)}
            aria-label={`Show slide ${i + 1}: ${s.eyebrow}`}
            aria-current={i === index}
            className={cn("h-2.5 rounded-full transition-all duration-300", i === index ? "w-8 bg-accent-bright" : "w-2.5 bg-on-inverse/40 hover:bg-on-inverse/70")}
          />
        ))}
      </div>
    </section>
  );
}
