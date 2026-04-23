import type { MetadataRoute } from "next";

const BASE = "https://mitigationrestorationservice.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const flPages = [
    { url: BASE, priority: 1.0, changeFrequency: "weekly" as const },
    { url: `${BASE}/services`, priority: 0.9, changeFrequency: "monthly" as const },
    { url: `${BASE}/about`, priority: 0.7, changeFrequency: "monthly" as const },
    { url: `${BASE}/faq`, priority: 0.8, changeFrequency: "monthly" as const },
    { url: `${BASE}/contact`, priority: 0.8, changeFrequency: "monthly" as const },
  ];

  const nyPages = [
    { url: `${BASE}/ny`, priority: 1.0, changeFrequency: "weekly" as const },
    { url: `${BASE}/ny/services`, priority: 0.9, changeFrequency: "monthly" as const },
    { url: `${BASE}/ny/about`, priority: 0.7, changeFrequency: "monthly" as const },
    { url: `${BASE}/ny/faq`, priority: 0.8, changeFrequency: "monthly" as const },
    { url: `${BASE}/ny/contact`, priority: 0.8, changeFrequency: "monthly" as const },
  ];

  return [...flPages, ...nyPages].map(({ url, priority, changeFrequency }) => ({
    url,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
