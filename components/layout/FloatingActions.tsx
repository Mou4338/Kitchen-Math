"use client";

import Link from "next/link";
import { ArrowUp, CalendarCheck, MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils/cn";

/** Floating "book an audit / WhatsApp" and back-to-top buttons, shown after the visitor scrolls. */
export function FloatingActions() {
  const [show, setShow] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  // Calculator pages have a result bar pinned to the bottom on phones, so lift the buttons there.
  const onCalculator = pathname.startsWith("/restaurant/") && pathname.endsWith("-calculator");
  const wa = SITE.company.whatsapp;

  return (
    <div
      className={cn(
        "no-print fixed right-4 z-30 flex flex-col items-end gap-2 transition-all duration-300 sm:right-6",
        onCalculator ? "bottom-24 lg:bottom-6" : "bottom-6",
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Back to top" className="grid h-11 w-11 place-items-center rounded-full border border-line bg-card text-ink shadow-lift transition hover:border-accent hover:text-accent">
        <ArrowUp className="h-5 w-5" aria-hidden />
      </button>
      {wa ? (
        <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center gap-2 rounded-full bg-sage px-5 font-semibold text-paper shadow-lift transition hover:brightness-110">
          <MessageCircle className="h-5 w-5" aria-hidden /> <span className="hidden sm:inline">WhatsApp us</span>
        </a>
      ) : (
        <Link href="/#contact" className="inline-flex h-12 items-center gap-2 rounded-full bg-accent px-5 font-semibold text-accent-ink shadow-glow transition hover:brightness-110">
          <CalendarCheck className="h-5 w-5" aria-hidden /> <span className="hidden sm:inline">Book a free audit</span>
        </Link>
      )}
    </div>
  );
}
