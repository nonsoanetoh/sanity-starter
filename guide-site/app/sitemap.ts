import type { MetadataRoute } from "next";
import { GUIDE_URL } from "~/lib/constants";
import { getAllPages } from "~/lib/nav";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: GUIDE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...getAllPages().map((page) => ({
      url: new URL(`/${page.slug}`, GUIDE_URL).toString(),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
