import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "@/components/ui/JsonLd";
import { breadcrumbSchema } from "@/lib/seo";
import { cn } from "@/lib/utils/cn";

export function Breadcrumbs({ items, onDark }: { items: { name: string; path: string }[]; onDark?: boolean }) {
  return (
    <>
      <nav aria-label="Breadcrumb" className="no-print">
        <ol className={cn("flex flex-wrap items-center gap-1 text-xs", onDark ? "text-on-inverse/70" : "text-muted")}>
          {items.map((it, i) => (
            <li key={it.path} className="flex items-center gap-1">
              {i > 0 ? <ChevronRight className={cn("h-3.5 w-3.5", onDark ? "text-on-inverse/40" : "text-muted-light")} aria-hidden /> : null}
              {i === items.length - 1 ? (
                <span aria-current="page" className={cn("font-medium", onDark ? "text-on-inverse" : "text-ink-soft")}>{it.name}</span>
              ) : (
                <Link href={it.path} className={onDark ? "hover:text-on-inverse" : "hover:text-ink"}>{it.name}</Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd data={breadcrumbSchema(items)} />
    </>
  );
}
