import Image from "next/image";
import { Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import type { Photo } from "@/lib/content/images";

/**
 * Photo banner used at the top of every inner page, in the same style as the home page hero:
 * photo + deep black overlay, white text.
 */
export function PageHero({
  photo, eyebrow, title, accent, subtitle, crumbs, children, compact,
}: {
  photo: Photo;
  eyebrow: string;
  /** Main words, shown in red. */
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
      {photo.fit === "contain" ? (
        <>
          {/* Phones and tablets: fill the banner behind the text */}
          <Image src={photo.src} alt={photo.alt} fill priority sizes="100vw" className="-z-10 object-cover lg:hidden" />
          {/* Desktops: the whole picture, uncropped, on the right, fading into the dark background */}
          <div
            className="absolute inset-y-0 right-0 -z-10 hidden max-w-[62%] [mask-image:linear-gradient(to_right,transparent,black_35%)] lg:block"
            style={{ aspectRatio: String(photo.aspect ?? 16 / 9) }}
            aria-hidden
          >
            <Image src={photo.src} alt="" fill priority sizes="62vw" className="object-cover" />
          </div>
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-inverse via-inverse/75 to-inverse/30" aria-hidden />
        </>
      ) : (
        <>
          <Image src={photo.src} alt={photo.alt} fill priority sizes="100vw" className="-z-10 object-cover" style={photo.position ? { objectPosition: photo.position } : undefined} />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-inverse via-inverse/75 to-inverse/30" aria-hidden />
        </>
      )}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-inverse/70 via-transparent to-transparent" aria-hidden />
      <div className="grid-lines grid-lines-inverse grid-fade absolute inset-0 -z-10 opacity-70" aria-hidden />

      <div className={compact ? "container py-10 sm:py-14" : "container py-14 sm:py-20 lg:py-24"}>
        <Breadcrumbs items={crumbs} onDark />
        <div className="mt-6 max-w-3xl text-on-inverse">
          <p className="inline-flex items-center gap-2 rounded-full border border-on-inverse/20 bg-on-inverse/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-accent-bright backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 shrink-0 text-star" aria-hidden /> {eyebrow}
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
