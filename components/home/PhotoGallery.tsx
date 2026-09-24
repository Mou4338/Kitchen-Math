import Image from "next/image";
import { Reveal } from "@/components/ui/Motion";
import { GALLERY } from "@/lib/content/images";
import { cn } from "@/lib/utils/cn";

/** "Built for real restaurants" photo gallery with hover zoom and captions. */
export function PhotoGallery() {
  return (
    <section className="container py-16 sm:py-24" aria-labelledby="gallery-title">
      <Reveal className="mx-auto mb-10 max-w-2xl text-center">
        <h2 id="gallery-title" className="text-4xl font-bold sm:text-5xl">
          Built for Real <span className="text-accent">Restaurants</span>
        </h2>
        <p className="mt-4 text-muted">From a single café counter to a busy cloud kitchen, the calculators are designed around how Indian food businesses actually run.</p>
      </Reveal>
      <div className="grid auto-rows-[180px] grid-cols-2 gap-3 sm:auto-rows-[220px] sm:gap-4 lg:grid-cols-4">
        {GALLERY.map((g, i) => (
          <Reveal
            key={g.src}
            delay={(i % 4) * 0.05}
            className={cn(i === 0 && "col-span-2 row-span-2", (i === 3 || i === 6) && "lg:col-span-2")}
          >
            <figure className="group relative h-full w-full overflow-hidden rounded-2xl bg-wash shadow-card">
              <Image src={g.src} alt={g.alt} fill sizes={i === 0 ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"} className="object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-inverse/85 via-inverse/10 to-transparent opacity-90 transition-opacity group-hover:opacity-100" aria-hidden />
              <figcaption className="absolute inset-x-0 bottom-0 p-4 text-sm font-semibold text-on-inverse sm:text-base">
                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-accent-bright align-middle" aria-hidden />
                {g.caption}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
