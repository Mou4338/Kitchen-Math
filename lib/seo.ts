import type { Metadata } from "next";
import { SITE } from "./site";
import type { CalculatorMeta } from "./content/calculators";

export function pageMetadata({ title, description, path, keywords }: { title: string; description: string; path: string; keywords?: string[] }): Metadata {
  const url = `${SITE.url}${path}`;
  return {
    title,
    description,
    keywords,
    alternates: { canonical: path },
    openGraph: { title, description, url, siteName: SITE.name, locale: SITE.locale, type: "website" },
    twitter: { card: "summary", title, description },
  };
}

export function calculatorMetadata(c: CalculatorMeta): Metadata {
  return pageMetadata({ title: c.seoTitle, description: c.seoDescription, path: `/restaurant/${c.slug}`, keywords: c.keywords });
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: `${SITE.url}${it.path}` })),
  };
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

export function calculatorAppSchema(c: CalculatorMeta) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: c.title,
    description: c.seoDescription,
    url: `${SITE.url}/restaurant/${c.slug}`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    inLanguage: "en-IN",
  };
}
