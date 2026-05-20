import { MetadataRoute } from "next";
import { TOOLS, CATEGORIES, Category } from "@/lib/tools";

const BASE = "https://bestaifinds.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const categoryPages: MetadataRoute.Sitemap = (
    Object.keys(CATEGORIES) as Category[]
  ).map((cat) => ({
    url: `${BASE}/${cat}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const toolPages: MetadataRoute.Sitemap = TOOLS.map((tool) => ({
    url: `${BASE}/${tool.category}/${tool.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: tool.featured ? 0.9 : 0.7,
  }));

  return [...staticPages, ...categoryPages, ...toolPages];
}
