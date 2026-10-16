import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import type { Service } from "@/lib/content/company";
import { ServiceIcon } from "./ServiceIcon";

/** Photo card for one consulting service. */
export function ServiceCard({ s, wide }: { s: Service; wide?: boolean }) {
  // Our own illustrations (in /public) are light, detailed images: no dark overlay, gentler zoom,
  // and served as the original sharp WebP (re-compressing them blurs their small text).
  const illustration = s.image.src.startsWith("/");
  return (
    <Link
      href={`/services#${s.id}`}
      className={`group flex h-full overflow-hidden rounded-3xl border border-line bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-star/60 hover:shadow-[0_0_0_1px_rgb(var(--star)/0.35),0_26px_50px_-22px_rgb(var(--star)/0.6)] ${wide ? "flex-col sm:flex-row" : "flex-col"}`}
    >
      <div className={`relative overflow-hidden ${illustration ? "bg-[#FBF6F2]" : "bg-inverse"} ${wide ? "aspect-[16/10] sm:aspect-auto sm:w-2/5" : "aspect-[16/10]"}`}>
        <Image src={s.image.src} alt={s.image.alt} fill unoptimized={illustration} sizes={wide ? "(min-width: 640px) 25vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"} className={`object-cover transition-transform duration-700 ${illustration ? "group-hover:scale-[1.04]" : "group-hover:scale-110"}`} />
        {!illustration && <div className="absolute inset-0 bg-gradient-to-t from-inverse/65 via-transparent to-transparent" aria-hidden />}
        <span className="absolute left-4 top-4 rounded-full bg-card/90 px-3 py-1 text-xs font-bold tracking-wider text-star-dark backdrop-blur">{s.number}</span>
        <span className="absolute bottom-4 left-4 grid h-11 w-11 place-items-center brand-gradient rounded-xl text-accent-ink shadow-glow transition-transform duration-300 group-hover:-rotate-6">
          <ServiceIcon name={s.icon} className="h-5 w-5" />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-bold">{s.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{s.summary}</p>
        <ul className="mt-4 grid gap-2">
          {s.bullets.slice(0, 3).map((b) => (
            <li key={b} className="flex gap-2 text-sm text-ink-soft">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
              {b}
            </li>
          ))}
        </ul>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-accent">
          Learn more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
        </span>
      </div>
    </Link>
  );
}
