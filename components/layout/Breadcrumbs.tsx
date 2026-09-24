import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "@/components/ui/JsonLd";
import { breadcrumbSchema } from "@/lib/seo";

export function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  return (
    <>
      <nav aria-label="Breadcrumb" className="no-print">
        <ol className="flex flex-wrap items-center gap-1 text-xs text-muted">
          {items.map((it, i) => (
            <li key={it.path} className="flex items-center gap-1">
              {i > 0 ? <ChevronRight className="h-3.5 w-3.5 text-muted-light" aria-hidden /> : null}
              {i === items.length - 1 ? (
                <span aria-current="page" className="font-medium text-ink-soft">{it.name}</span>
              ) : (
                <Link href={it.path} className="hover:text-ink">{it.name}</Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd data={breadcrumbSchema(items)} />
    </>
  );
}
