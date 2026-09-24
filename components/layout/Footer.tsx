import Link from "next/link";
import { CALCULATORS } from "@/lib/content/calculators";
import { SITE } from "@/lib/site";
import { Logo } from "./Header";

export function Footer() {
  return (
    <footer className="no-print mt-20 border-t border-line bg-card">
      <div className="container grid gap-10 py-12 md:grid-cols-[1.2fr_1fr_1fr]">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-3 text-sm leading-relaxed text-muted">{SITE.description}</p>
          <p className="mt-3 text-xs leading-relaxed text-muted-light">
            Results are estimates based on the numbers you enter. Benchmarks are indicative. Nothing here is financial, tax or legal advice.
          </p>
        </div>
        <nav aria-label="Calculators">
          <p className="eyebrow mb-3">Calculators</p>
          <ul className="grid gap-2 text-sm">
            {CALCULATORS.map((c) => (
              <li key={c.slug}><Link className="text-ink-soft hover:text-accent-dark" href={`/restaurant/${c.slug}`}>{c.shortTitle}</Link></li>
            ))}
          </ul>
        </nav>
        <nav aria-label="More">
          <p className="eyebrow mb-3">More</p>
          <ul className="grid gap-2 text-sm">
            <li><Link className="text-ink-soft hover:text-accent-dark" href="/">Home</Link></li>
            <li><Link className="text-ink-soft hover:text-accent-dark" href="/services">Growth consulting services</Link></li>
            <li><Link className="text-ink-soft hover:text-accent-dark" href="/#contact">Book a free growth audit</Link></li>
            <li><Link className="text-ink-soft hover:text-accent-dark" href="/growth-scorecard">Growth scorecard</Link></li>
            <li><Link className="text-ink-soft hover:text-accent-dark" href="/restaurant">Free tools</Link></li>
            <li><Link className="text-ink-soft hover:text-accent-dark" href="/restaurant/guides">Guides</Link></li>
            <li><Link className="text-ink-soft hover:text-accent-dark" href="/restaurant/help">Help &amp; how-to</Link></li>
            <li><Link className="text-ink-soft hover:text-accent-dark" href="/restaurant/calculator-history">Saved scenarios</Link></li>
            <li><Link className="text-ink-soft hover:text-accent-dark" href="/restaurant/about">About</Link></li>
            <li><Link className="text-ink-soft hover:text-accent-dark" href="/privacy">Privacy</Link></li>
            <li><Link className="text-ink-soft hover:text-accent-dark" href="/terms">Terms</Link></li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-line">
        <div className="container flex flex-wrap items-center justify-between gap-2 py-5 text-xs text-muted">
          <span>© {new Date().getFullYear()} {SITE.name}. Made in India.</span>
          <span>Free. No login. Your numbers stay on your device.</span>
        </div>
      </div>
    </footer>
  );
}
