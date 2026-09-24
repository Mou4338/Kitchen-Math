"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { getTheme, setTheme, subscribeTheme, type Theme } from "@/lib/theme";
import { cn } from "@/lib/utils/cn";

/** Switch between the white & blue (light) and black & gold (dark) themes. */
export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore<Theme | null>(subscribeTheme, getTheme, () => null);
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light theme (white and blue)" : "Switch to dark theme (black and gold)"}
      title={isDark ? "Light theme" : "Dark theme"}
      className={cn(
        "relative grid h-10 w-10 place-items-center overflow-hidden rounded-xl border border-line bg-card text-ink transition-colors hover:border-accent hover:text-accent",
        className,
      )}
    >
      <Sun className={cn("absolute h-[18px] w-[18px] transition-all duration-300", isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-50 opacity-0")} aria-hidden />
      <Moon className={cn("absolute h-[18px] w-[18px] transition-all duration-300", isDark ? "rotate-90 scale-50 opacity-0" : "rotate-0 scale-100 opacity-100")} aria-hidden />
    </button>
  );
}
