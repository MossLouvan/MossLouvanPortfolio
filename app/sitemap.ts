import type { MetadataRoute } from "next";

/**
 * Single-page site, so the sitemap is one entry. It exists mainly so crawlers
 * get an explicit canonical URL and a lastModified signal.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://mosslouvan.com",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
