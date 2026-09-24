import Image from "next/image";
import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import type { Photo } from "@/lib/content/images";

/**
 * Photo banner used at the top of every inner page, in the same style as the home page hero:
 * photo + navy/blue overlay (light theme) or black/gold overlay (dark theme), white text.
 */
export function PageHero({
  photo, eyebrow, title, accent, subtitle, crumbs, children, compact,
}: {
  photo: Photo;
  eyebrow: string;
  /** Main words, shown in light blue (gold in dark mode). */
  title: string;
  /** Final word(s), shown in white serif italic. */
  accent?: string;
  subtitle?: string;
  crumbs: { name: string; path: string }[];
  children?: ReactNode;
  compact?: boolean;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-inverse">
      <Image src={photo.src} alt={photo.alt} fill priority sizes="100vw" className="-z-10 object-cover" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-inverse via-inverse/85 to-inverse/40" aria-hidden />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-inverse/70 via-transparent to-transparent" aria-hidden />
      <div className="absolute inset-0 -z-10 bg-accent/10 mix-blend-color" aria-hidden />

      <div className={compact ? "container py-10 sm:py-14" : "container py-14 sm:py-20 lg:py-24"}>
        <Breadcrumbs items={crumbs} onDark />
        <div className="mt-6 max-w-3xl text-on-inverse">
          <p className="inline-flex items-center gap-2 rounded-full border border-on-inverse/20 bg-on-inverse/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-accent-bright backdrop-blur">
            {eyebrow}
          </p>
          <h1 className="mt-5 text-[2.2rem] font-semibold leading-[1.06] text-on-inverse sm:text-5xl lg:text-[3.4rem]">
            <span className="text-accent-bright">{title}</span>
            {accent ? <> <span className="font-serif font-normal italic">{accent}</span></> : null}
          </h1>
          {subtitle ? <p className="mt-5 max-w-2xl text-base leading-relaxed text-on-inverse/80 sm:text-lg">{subtitle}</p> : null}
          {children ? <div className="mt-7">{children}</div> : null}
        </div>
      </div>
    </section>
  );
}
