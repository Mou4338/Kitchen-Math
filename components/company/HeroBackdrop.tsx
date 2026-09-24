"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { COMPANY_IMAGES } from "@/lib/content/company";
import { cn } from "@/lib/utils/cn";

/**
 * Slow cross-fading photo background with a gentle zoom (Ken Burns).
 * Pauses for visitors who prefer reduced motion.
 */
export function HeroBackdrop() {
  const slides = COMPANY_IMAGES.heroSlides;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      setIndex((i) => (i + 1) % slides.length);
    }, 7000);
    return () => window.clearInterval(id);
  }, [slides.length]);

  return (
    <div className="absolute inset-0 -z-10" aria-hidden>
      {slides.map((s, i) => (
        <div key={s.src} className={cn("absolute inset-0 transition-opacity duration-[1800ms] ease-in-out", i === index ? "opacity-100" : "opacity-0")}>
          <Image
            src={s.src}
            alt=""
            fill
            priority={i === 0}
            sizes="100vw"
            className={cn("object-cover transition-transform duration-[9000ms] ease-out", i === index ? "scale-110" : "scale-100")}
          />
        </div>
      ))}
    </div>
  );
}
