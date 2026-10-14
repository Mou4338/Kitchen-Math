"use client";

import { Clock, Copy, Mail, MapPin, Navigation } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/Toast";
import { SERVICES } from "@/lib/content/company";
import { SITE } from "@/lib/site";

const c = SITE.company;
const DIRECTIONS = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.address)}`;
const TOPICS = [...SERVICES.map((s) => s.title), "General inquiry"];


async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/** Helpline, topic picker, office address and business hours (Contact page). Topics pre-fill the enquiry form. */
export function ContactDetails() {
  const { toast } = useToast();

  return (
    <div className="grid gap-5">
      {/* Helpline */}
      <div className="band-sheen relative isolate flex flex-col gap-5 overflow-hidden rounded-3xl p-6 text-on-inverse shadow-lift sm:flex-row sm:items-center sm:p-7">
        <div className="grid-lines grid-lines-inverse absolute inset-0 -z-10" aria-hidden />
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-accent shadow-[0_8px_18px_-8px_rgb(0_0_0/0.5)]"><Mail className="h-5 w-5" aria-hidden /></span>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold text-on-inverse">Our helpline</h3>
          <p className="mt-1 text-sm leading-relaxed text-on-inverse/80">Questions about your menu, pricing, ads or delivery apps? Email us and a growth consultant will reply within one business day.</p>
          <a href={`mailto:${c.email}`} className="mt-3 inline-block break-all font-mono text-[15px] font-semibold text-on-inverse hover:underline">{c.email}</a>
        </div>
        <button
          type="button"
          onClick={async () => toast((await copy(c.email)) ? "Email copied" : c.email)}
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 self-start rounded-full bg-white px-5 text-sm font-semibold text-[#2A0E14] shadow-[0_10px_22px_-12px_rgb(0_0_0/0.6)] transition hover:-translate-y-0.5 sm:self-center"
        >
          <Copy className="h-4 w-4" aria-hidden /> Copy email
        </button>
      </div>

      {/* Topics */}
      <div>
        <p className="eyebrow text-star-dark">What would you like to discuss?</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {TOPICS.map((t) => (
            <Link
              key={t}
              href={`/contact?topic=${encodeURIComponent(t)}#enquiry`}
              className="inline-flex min-h-[44px] items-center rounded-full border border-line bg-card px-4 text-sm font-medium text-ink-soft transition hover:border-accent/50 hover:bg-accent hover:text-accent-ink"
            >
              {t}
            </Link>
          ))}
        </div>
      </div>

      {/* Office */}
      <div className="flex gap-4 rounded-3xl border border-line bg-card p-5 shadow-card sm:p-6">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent-dark"><MapPin className="h-5 w-5" aria-hidden /></span>
        <div className="min-w-0">
          <h3 className="font-bold">Office</h3>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft">{c.address}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={async () => toast((await copy(c.address)) ? "Address copied" : c.address)} className="inline-flex h-10 items-center gap-1.5 rounded-full border border-line-strong px-3.5 text-sm font-medium text-ink-soft transition hover:border-accent/50 hover:text-ink">
              <Copy className="h-3.5 w-3.5" aria-hidden /> Copy address
            </button>
            <a href={DIRECTIONS} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center gap-1.5 rounded-full border border-line-strong px-3.5 text-sm font-medium text-ink-soft transition hover:border-accent/50 hover:text-ink">
              <Navigation className="h-3.5 w-3.5" aria-hidden /> Get directions
            </a>
          </div>
        </div>
      </div>

      {/* Hours */}
      <div className="flex gap-4 rounded-3xl border border-line bg-card p-5 shadow-card sm:p-6">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-star-soft text-star-dark"><Clock className="h-5 w-5" aria-hidden /></span>
        <div>
          <h3 className="font-bold">Business hours</h3>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft">{c.hours}</p>
        </div>
      </div>
    </div>
  );
}

const NEXT = [
  { title: "Inquiry received", body: "You get a confirmation straight away." },
  { title: "Growth call", body: "A consultant calls you within one business day." },
  { title: "Audit plan", body: "If there is a fit, you receive the audit scope and fees in writing." },
];

/** "What happens next" steps and a stylised location map (full width under the contact section). */
export function ContactNextSteps() {
  return (
    <div className="mt-10 grid gap-8 lg:mt-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-10">
      <div>
        <p className="eyebrow text-star-dark">What happens next</p>
        <ol className="mt-4 grid gap-4 sm:grid-cols-3">
          {NEXT.map((s, i) => (
            <li key={s.title} className="rounded-3xl border border-line bg-card p-5 shadow-card">
              <span className="brand-gradient grid h-9 w-9 place-items-center rounded-full text-sm font-bold text-accent-ink [text-shadow:0_1px_2px_rgb(0_0_0/0.25)]">{i + 1}</span>
              <h3 className="mt-4 font-bold">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
      <a
        href={DIRECTIONS}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${c.building}, ${c.area} in Google Maps`}
        className="group relative block min-h-[240px] overflow-hidden rounded-3xl border border-line bg-wash shadow-card"
      >
        {/* Stylised street map (illustration, not to scale) */}
        <svg viewBox="0 0 600 300" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
          <rect width="600" height="300" fill="rgb(var(--wash))" />
          <g fill="rgb(var(--line-strong))" opacity="0.7">
            <rect x="200" y="110" width="70" height="60" rx="8" />
            <rect x="440" y="10" width="60" height="50" rx="8" />
            <rect x="40" y="200" width="90" height="60" rx="8" />
          </g>
          <g stroke="rgb(var(--card))" strokeWidth="16" fill="none">
            <path d="M0 70 H600" />
            <path d="M0 225 C150 205 330 245 600 215" />
            <path d="M180 0 V300" />
            <path d="M410 0 L380 300" />
          </g>
          <g stroke="rgb(var(--line-strong))" strokeWidth="3" fill="none">
            <path d="M0 150 H600" />
            <path d="M300 0 V300" />
            <path d="M520 0 V300" />
          </g>
          <path d="M0 250 Q150 230 300 262 T600 245" stroke="rgb(var(--star) / 0.55)" strokeWidth="5" fill="none" />
        </svg>
        <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-[85%] items-end gap-3">
          <svg viewBox="0 0 40 52" className="h-14 w-11 drop-shadow-[0_8px_10px_rgb(0_0_0/0.3)] transition-transform group-hover:-translate-y-1" aria-hidden>
            <path d="M20 0C9 0 0 9 0 20c0 14 20 32 20 32s20-18 20-32C40 9 31 0 20 0z" fill="rgb(var(--accent))" />
            <circle cx="20" cy="20" r="7" fill="#fff" />
          </svg>
          <span className="mb-6 rounded-xl border border-line bg-card px-3.5 py-2 shadow-lift">
            <span className="block font-semibold text-ink">{c.building}</span>
            <span className="block text-xs text-muted">{c.area}</span>
          </span>
        </div>
        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-card/90 px-3 py-1.5 text-xs font-semibold text-accent-dark shadow-card backdrop-blur">
          <Navigation className="h-3.5 w-3.5" aria-hidden /> Get directions
        </span>
      </a>
    </div>
  );
}
