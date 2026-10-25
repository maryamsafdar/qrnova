import { useEffect } from "react";

export const SITE_NAME = "QRNova";
export const SITE_URL = "https://qrnova-neon.vercel.app";

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export interface SeoConfig {
  title: string;
  description: string;
  path: string;
  breadcrumbs?: BreadcrumbItem[];
  structuredData?: Record<string, unknown>[];
}

function upsertMeta(attr: "name" | "property", key: string, content: string): void {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attr, key);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

function upsertLink(rel: string, href: string): void {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
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

function buildBreadcrumbSchema(items: BreadcrumbItem[]): Record<string, unknown> {
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

const WEBSITE_SCHEMA: Record<string, unknown> = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: "en",
};

const WEB_APPLICATION_SCHEMA: Record<string, unknown> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: SITE_NAME,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  url: SITE_URL,
  description: "Free browser-based QR code generator to create, customize and download QR codes for URLs, Wi-Fi, contacts, social media and more.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export function useSeo(config: SeoConfig): void {
  const { title, description, path, breadcrumbs, structuredData } = config;

  useEffect(() => {
    // Canonical URLs always use the production origin and omit query parameters.
    const canonicalPath = path === "/" ? "/" : path.replace(/\/$/, "");
    const canonical = `${SITE_URL}${canonicalPath}`;
    document.title = title;
    upsertMeta("name", "description", description);
    upsertMeta("name", "robots", window.location.hostname === "qrnova-neon.vercel.app" ? "index,follow" : "noindex,nofollow");
    upsertLink("canonical", canonical);
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", canonical);
    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:site_name", SITE_NAME);
    upsertMeta("property", "og:locale", "en_US");
    upsertMeta("name", "twitter:card", "summary");
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);

    const graph: Record<string, unknown>[] = [WEBSITE_SCHEMA, WEB_APPLICATION_SCHEMA];
    if (breadcrumbs?.length) graph.push(buildBreadcrumbSchema(breadcrumbs));
    if (structuredData) graph.push(...structuredData);
    upsertJsonLd("qrnova-structured-data", graph);
  }, [title, description, path, breadcrumbs, structuredData]);
}
