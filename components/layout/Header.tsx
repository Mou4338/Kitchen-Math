"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CALCULATORS } from "@/lib/content/calculators";
import { CalculatorIcon } from "@/components/ui/CalculatorIcon";
import { buttonClass } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import { SITE } from "@/lib/site";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/restaurant", label: "Tools" },
  { href: "/restaurant/guides", label: "Guides" },
  { href: "/restaurant/calculator-history", label: "History" },
  { href: "/restaurant/help", label: "Help" },
  { href: "/restaurant/about", label: "About" },
];

export function Logo({ onClick }: { onClick?: () => void } = {}) {
  return (
    <Link href="/" onClick={onClick} className="flex items-center gap-2.5 font-semibold tracking-tight text-ink" aria-label={`${SITE.name} home`}>
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-inverse text-sm font-bold text-accent-bright">₹</span>
      <span className="text-[17px]">{SITE.name}</span>
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [calcOpen, setCalcOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) => (href === "/" || href === "/restaurant" ? pathname === href : pathname.startsWith(href));
  const calcActive = CALCULATORS.some((c) => pathname.startsWith(`/restaurant/${c.slug}`));
  const navClass = (active: boolean) =>
    cn(
      "relative rounded-lg px-2.5 py-2 text-sm font-medium transition-colors hover:bg-wash hover:text-ink",
      active ? "text-accent after:absolute after:inset-x-3 after:-bottom-[13px] after:h-0.5 after:rounded-full after:bg-accent" : "text-muted",
    );

  const closeMenus = () => {
    setMenuOpen(false);
    setCalcOpen(false);
  };

  useEffect(() => {
    if (!calcOpen) return;
    const close = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setCalcOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setCalcOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [calcOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="no-print sticky top-0 z-40 border-b border-line/70 bg-paper/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Logo onClick={closeMenus} />
        <nav aria-label="Main" className="hidden items-center gap-0.5 xl:flex">
          {NAV.slice(0, 3).map((n) => (
            <Link onClick={closeMenus} key={n.href} href={n.href} aria-current={isActive(n.href) ? "page" : undefined} className={navClass(isActive(n.href))}>{n.label}</Link>
          ))}
          <div className="relative" ref={dropRef}>
            <button
              type="button"
              aria-expanded={calcOpen}
              aria-controls="calc-menu"
              onClick={() => setCalcOpen((o) => !o)}
              className={cn(navClass(calcActive), "inline-flex items-center gap-1", calcOpen && "bg-wash text-ink")}
            >
              Calculators <ChevronDown className={cn("h-4 w-4 transition-transform", calcOpen && "rotate-180")} aria-hidden />
            </button>
            <AnimatePresence>
              {calcOpen ? (
                <motion.div
                  id="calc-menu"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-1/2 top-[calc(100%+8px)] grid w-[560px] -translate-x-1/2 grid-cols-2 gap-1 rounded-2xl border border-line bg-card p-2 shadow-lift"
                >
                  {CALCULATORS.map((c) => (
                    <Link onClick={closeMenus} key={c.slug} href={`/restaurant/${c.slug}`} className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-wash">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent-dark">
                        <CalculatorIcon name={c.icon} className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-medium text-ink">{c.shortTitle}</span>
                        <span className="block truncate text-xs text-muted">{c.metrics.slice(0, 3).join(" · ")}</span>
                      </span>
                    </Link>
                  ))}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
          {NAV.slice(3).map((n) => (
            <Link onClick={closeMenus} key={n.href} href={n.href} aria-current={isActive(n.href) ? "page" : undefined} className={navClass(isActive(n.href))}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link onClick={closeMenus} href="/#contact" className={buttonClass("accent", "sm", "hidden sm:inline-flex")}>
            Free growth audit
          </Link>
          <button type="button" className="grid h-10 w-10 place-items-center rounded-lg text-ink hover:bg-wash xl:hidden" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen((o) => !o)}>
            {menuOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobile"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-line bg-paper xl:hidden"
          >
            <div className="container max-h-[calc(100dvh-4rem)] overflow-y-auto pb-8 pt-4">
              <p className="eyebrow mb-2">Calculators</p>
              <div className="grid gap-1 sm:grid-cols-2">
                {CALCULATORS.map((c) => (
                  <Link onClick={closeMenus} key={c.slug} href={`/restaurant/${c.slug}`} className="flex min-h-[48px] items-center gap-3 rounded-xl px-2 hover:bg-wash">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent-soft text-accent-dark">
                      <CalculatorIcon name={c.icon} className="h-4 w-4" />
                    </span>
                    <span className="text-[15px] font-medium">{c.shortTitle}</span>
                  </Link>
                ))}
              </div>
              <div className="mt-4 grid gap-1 border-t border-line pt-4">
                {NAV.map((n) => (
                  <Link onClick={closeMenus} key={n.href} href={n.href} aria-current={isActive(n.href) ? "page" : undefined} className={cn("flex min-h-[48px] items-center rounded-xl px-2 text-[15px] font-medium hover:bg-wash", isActive(n.href) && "bg-accent-soft text-accent-dark")}>{n.label}</Link>
                ))}
              </div>
              <Link onClick={closeMenus} href="/#contact" className={buttonClass("accent", "lg", "mt-4 w-full")}>Book a free growth audit</Link>
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
