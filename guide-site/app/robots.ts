import type { MetadataRoute } from "next";
import { GUIDE_URL } from "~/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${GUIDE_URL}/sitemap.xml`,
  };
}
