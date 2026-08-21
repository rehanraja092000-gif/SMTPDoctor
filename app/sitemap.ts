import type { MetadataRoute } from "next";
import { TOOLS, SITE } from "../lib/tools";
import { GUIDES } from "../lib/guides";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE.url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE.url}/guides`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    ...TOOLS.map((tool) => ({
      url: `${SITE.url}/tools/${tool.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...GUIDES.map((g) => ({
      url: `${SITE.url}/guides/${g.slug}`,
      lastModified: new Date(g.updated),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
