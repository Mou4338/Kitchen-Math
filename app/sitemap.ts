import type { MetadataRoute } from "next";
import { CALCULATORS } from "@/lib/content/calculators";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPaths = ["/restaurant", "/restaurant/guides", "/restaurant/help", "/restaurant/about", "/privacy", "/terms"];
  return [
    ...staticPaths.map((p) => ({ url: `${SITE.url}${p}`, lastModified: now, changeFrequency: "monthly" as const, priority: p === "/restaurant" ? 1 : 0.5 })),
    ...CALCULATORS.map((c) => ({ url: `${SITE.url}/restaurant/${c.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.9 })),
  ];
}
