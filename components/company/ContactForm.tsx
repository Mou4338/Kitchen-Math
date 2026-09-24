"use client";

import { Send } from "lucide-react";
import { useId, useState } from "react";
import { SITE } from "@/lib/site";

const PLATFORMS = ["Swiggy", "Zomato", "Own website / app", "Dine-in only"];

/**
 * Enquiry form without a backend: it opens the visitor's email app with a pre-filled message.
 * Replace with a form service (Formspree, Resend, etc.) later if you want submissions stored.
 */
export function ContactForm() {
  const id = useId();
  const [name, setName] = useState("");
  const [restaurant, setRestaurant] = useState("");
  const [city, setCity] = useState("");
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const field = "h-12 w-full rounded-xl border border-line-strong bg-card px-4 text-sm text-ink outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/15";

  return (
    <form
      className="grid gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!name.trim() || !restaurant.trim()) {
          setError("Please add your name and your restaurant's name.");
          return;
        }
        setError(null);
        const body = [
          `Name: ${name}`,
          `Restaurant: ${restaurant}`,
          city ? `City: ${city}` : "",
          platforms.length ? `Sells on: ${platforms.join(", ")}` : "",
          "",
          message || "I'd like a free growth audit for my restaurant.",
        ].filter((l, i, a) => l !== "" || a[i - 1] !== "").join("\n");
        const href = `mailto:${SITE.company.email}?subject=${encodeURIComponent(`Growth audit request: ${restaurant}`)}&body=${encodeURIComponent(body)}`;
        window.location.href = href;
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm font-medium">Your name *<input id={`${id}-n`} value={name} onChange={(e) => setName(e.target.value)} className={field} autoComplete="name" /></label>
        <label className="grid gap-1.5 text-sm font-medium">Restaurant name *<input id={`${id}-r`} value={restaurant} onChange={(e) => setRestaurant(e.target.value)} className={field} autoComplete="organization" /></label>
      </div>
      <label className="grid gap-1.5 text-sm font-medium">City<input value={city} onChange={(e) => setCity(e.target.value)} className={field} autoComplete="address-level2" placeholder="e.g. Pune" /></label>
      <fieldset>
        <legend className="text-sm font-medium">Where do you sell?</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {PLATFORMS.map((p) => {
            const on = platforms.includes(p);
            return (
              <button
                key={p}
                type="button"
                aria-pressed={on}
                onClick={() => setPlatforms(on ? platforms.filter((x) => x !== p) : [...platforms, p])}
                className={`h-10 rounded-full border px-4 text-sm font-medium transition ${on ? "border-accent bg-accent text-accent-ink" : "border-line-strong bg-card text-ink-soft hover:border-accent"}`}
              >
                {p}
              </button>
            );
          })}
        </div>
      </fieldset>
      <label className="grid gap-1.5 text-sm font-medium">What would you like to improve?
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} className="w-full rounded-xl border border-line-strong bg-card px-4 py-3 text-sm text-ink outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/15" placeholder="e.g. More orders at dinner, better ratings, lower ad spend…" />
      </label>
      {error ? <p role="alert" className="text-sm font-medium text-danger">{error}</p> : null}
      <button type="submit" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-accent px-6 font-semibold text-accent-ink shadow-glow transition hover:brightness-110 active:scale-[0.98]">
        <Send className="h-4 w-4" aria-hidden /> Request my free growth audit
      </button>
      <p className="text-xs text-muted">This opens your email app with your details filled in. Nothing is sent until you press send there.</p>
    </form>
  );
}
