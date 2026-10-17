import Link from "next/link";
import { CALCULATORS } from "@/lib/content/calculators";
import { SITE } from "@/lib/site";
import { Logo } from "./Header";

const ink = "text-[rgb(var(--footer-ink))]";
/** White text lifted off the red with a soft shadow (black). */
const lift = "[text-shadow:0_1px_2px_rgb(var(--shade)/0.45),0_2px_10px_rgb(var(--shade)/0.3)]";
const link = `${ink} ${lift} font-medium opacity-90 transition hover:opacity-100 hover:underline underline-offset-4`;

const MORE_LINKS: [string, string][] = [
  ["Home", "/"],
  ["Growth consulting services", "/services"],
  ["Book a free growth audit", "/#contact"],
  ["Growth scorecard", "/growth-scorecard"],
  ["Free tools", "/restaurant"],
  ["Guides", "/restaurant/help#guides"],
  ["Help & how-to", "/restaurant/help"],
  ["Saved scenarios", "/restaurant/calculator-history"],
  ["About", "/restaurant/about"],
  ["Contact", "/contact"],
  ["Privacy", "/privacy"],
  ["Terms", "/terms"],
];

/** Zomato-red footer (same in both themes) with white text, a faint grid and soft gray shadows. */
export function Footer() {
  return (
    <footer className={`no-print relative isolate mt-20 overflow-hidden bg-[linear-gradient(160deg,rgb(var(--footer-a))_0%,rgb(var(--footer-b))_100%)] ${ink} shadow-[0_-24px_50px_-24px_rgb(120_120_130/0.55)]`}>
      {/* light top edge so the footer reads as a raised panel */}
      <div className="absolute inset-x-0 top-0 h-0.5 bg-[linear-gradient(90deg,transparent,rgb(var(--star))_30%,rgb(var(--star))_70%,transparent)] opacity-80" aria-hidden />

      <div className="container grid gap-10 py-14 md:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] md:gap-x-14 lg:gap-x-20">
        <div className="max-w-sm">
          <Logo onAccent />
          <p className={`mt-4 text-sm leading-relaxed ${lift}`}>{SITE.description}</p>
          <a href={`mailto:${SITE.company.email}`} className={`${link} mt-4 inline-flex items-center gap-2 text-sm`}>
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 6L2 7" /></svg>
            {SITE.company.email}
          </a>
          <p className={`mt-4 rounded-xl border border-white/15 bg-[rgb(var(--shade)/0.15)] p-3 text-xs leading-relaxed ${lift} opacity-95 shadow-[0_12px_28px_-14px_rgb(var(--shade)/0.5)]`}>
            Results are estimates based on the numbers you enter. Benchmarks are indicative. Nothing here is financial, tax or legal advice.
          </p>
        </div>
        {/* Link columns sit together, centred in the space beside the brand block: Calculators, then More right beside it. */}
        <div className="flex flex-wrap gap-x-14 gap-y-10 md:justify-self-center lg:gap-x-16">
        <nav aria-label="Calculators">
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] opacity-80 [text-shadow:0_1px_2px_rgb(var(--shade)/0.4)]">Calculators</p>
          <ul className="grid gap-2.5 text-sm">
            {CALCULATORS.map((c) => (
              <li key={c.slug}><Link className={link} href={`/restaurant/${c.slug}`}>{c.shortTitle}</Link></li>
            ))}
          </ul>
        </nav>
        <nav aria-label="More">
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] opacity-80 [text-shadow:0_1px_2px_rgb(var(--shade)/0.4)]">More</p>
          {/* Two independent columns, so a long link never leaves a gap beside a short one. */}
          <div className="grid gap-y-2.5 text-sm sm:grid-cols-2 sm:gap-x-10">
            {[MORE_LINKS.slice(0, 6), MORE_LINKS.slice(6)].map((col, i) => (
              <ul key={i} className="flex flex-col gap-2.5">
                {col.map(([label, href]) => (
                  <li key={href}><Link className={`${link} whitespace-nowrap`} href={href}>{label}</Link></li>
                ))}
              </ul>
            ))}
          </div>
        </nav>
        </div>
      </div>
      <div className="border-t border-[rgb(var(--shade)/0.15)] bg-[rgb(var(--shade)/0.1)]">
        <div className={`container flex flex-wrap items-center justify-between gap-2 py-5 text-xs font-medium opacity-90 ${lift}`}>
          <span>© {new Date().getFullYear()} {SITE.name}. Made in India.</span>
          <span>Free. No login. Your numbers stay on your device.</span>
        </div>
      </div>
    </footer>
  );
}
