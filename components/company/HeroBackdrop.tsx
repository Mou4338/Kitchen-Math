"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { COMPANY_IMAGES } from "@/lib/content/company";
import { cn } from "@/lib/utils/cn";

/**
 * Slow cross-fading photo background with a gentle zoom (Ken Burns).
 * Phones load a tall, smart-cropped version of each photo so nothing important is cut off;
 * tablets and desktops load the wide version. Pauses for visitors who prefer reduced motion.
 */
export function HeroBackdrop() {
  const slides = COMPANY_IMAGES.heroSlides;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      setIndex((i) => (i + 1) % slides.length);
    }, 6000);
    return () => window.clearInterval(id);
  }, [slides.length]);

  return (
    <div className="absolute inset-0 -z-10" aria-hidden>
      {slides.map((s, i) => {
        const active = i === index;
        const zoom = cn("object-cover transition-transform duration-[9000ms] ease-out", active ? "scale-105 md:scale-110" : "scale-100");
        return (
          <div key={s.src} className={cn("absolute inset-0 transition-opacity duration-[1800ms] ease-in-out", active ? "opacity-100" : "opacity-0")}>
            {/* Phones: portrait crop */}
            <Image src={s.mobileSrc} alt="" fill priority={i === 0} sizes="100vw" className={cn(zoom, "object-center md:hidden")} />
            {/* Tablets & desktops: wide photo */}
            <Image src={s.src} alt="" fill priority={i === 0} sizes="100vw" className={cn(zoom, "hidden md:block")} />
          </div>
        );
      })}
    </div>
  );
}
