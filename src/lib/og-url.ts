import { CardConfig } from "@/types";
import { PRODUCTION_DOMAIN } from "@/config/constants";

/**
 * Generates the relative API path for an Open Graph card
 */
export function generateOgPath(params: Partial<CardConfig>): string {
  const title = (params.title || "").trim() || "Your Dynamic Title Goes Here";
  const tag = (params.tag || "").trim() || "ARTICLE";
  const theme = params.theme || "dark";
  const key = (params.licenseKey || "").trim();
  const description = (params.description || "").trim();

  const searchParams = new URLSearchParams();
  searchParams.set("title", title);
  searchParams.set("tag", tag);
  searchParams.set("theme", theme);

  if (description) {
    searchParams.set("description", description);
  }

  if (key) {
    searchParams.set("key", key);
  }

  return `/api/og?${searchParams.toString()}`;
}

/**
 * Resolves the full URL for the Open Graph image endpoint,
 * defaulting to the official production domain if origin is local or undefined.
 */
export function generateFullOgUrl(
  params: Partial<CardConfig>,
  clientOrigin?: string
): string {
  const origin =
    clientOrigin && !clientOrigin.includes("localhost")
      ? clientOrigin
      : PRODUCTION_DOMAIN;

  return `${origin}${generateOgPath(params)}`;
}

/**
 * Generates an HTML <meta property="og:image"> tag snippet
 */
export function generateMetaTagSnippet(fullOgUrl: string): string {
  return `<meta property="og:image" content="${fullOgUrl}" />`;
}
