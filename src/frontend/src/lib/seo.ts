import { useEffect } from "react";

export const SITE_NAME = "QRNova";
export const SITE_URL = "https://qrnova.app";

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export interface SeoConfig {
  title: string;
  description: string;
  path: string;
  breadcrumbs?: BreadcrumbItem[];
  /** Extra structured data merged into the page's JSON-LD graph. */
  structuredData?: Record<string, unknown>[];
}

function upsertMeta(
  attr: "name" | "property",
  key: string,
  content: string,
): void {
  let element = document.head.querySelector<HTMLMetaElement>(
    `meta[${attr}="${key}"]`,
  );
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attr, key);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

function upsertLink(rel: string, href: string): void {
  let element = document.head.querySelector<HTMLLinkElement>(
    `link[rel="${rel}"]`,
  );
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }
  element.setAttribute("href", href);
}

function upsertJsonLd(id: string, data: unknown): void {
  let element = document.getElementById(id) as HTMLScriptElement | null;
  if (!element) {
    element = document.createElement("script");
    element.id = id;
    element.type = "application/ld+json";
    document.head.appendChild(element);
  }
  element.textContent = JSON.stringify(data);
}

function buildBreadcrumbSchema(
  items: BreadcrumbItem[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

const WEB_APPLICATION_SCHEMA: Record<string, unknown> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: SITE_NAME,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  url: SITE_URL,
  description:
    "Free browser-based QR code generator to create, customize and download QR codes for URLs, Wi-Fi, contacts, social media and more.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

/**
 * Apply per-page SEO metadata: title, description, canonical, Open Graph,
 * breadcrumbs and structured data. Exactly one H1 per page is the page's
 * responsibility; this hook owns everything in the document head.
 */
export function useSeo(config: SeoConfig): void {
  const { title, description, path, breadcrumbs, structuredData } = config;

  useEffect(() => {
    const canonical = `${SITE_URL}${path}`;
    document.title = title;
    upsertMeta("name", "description", description);
    upsertLink("canonical", canonical);

    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", canonical);
    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:site_name", SITE_NAME);

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);

    const graph: Record<string, unknown>[] = [WEB_APPLICATION_SCHEMA];
    if (breadcrumbs && breadcrumbs.length > 0) {
      graph.push(buildBreadcrumbSchema(breadcrumbs));
    }
    if (structuredData) graph.push(...structuredData);
    upsertJsonLd("qrnova-structured-data", graph);
  }, [title, description, path, breadcrumbs, structuredData]);
}
