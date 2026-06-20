import type { Metadata } from "next";
import { GUIDE_URL, SITE_DESCRIPTION, SITE_NAME } from "~/lib/constants";
import type { DocPage } from "~/lib/nav";

const siteKeywords = [
  "ACTTA Studio",
  "Sanity",
  "Next.js",
  "headless CMS",
  "Sanity starter",
  "documentation",
];

export const siteMetadata: Metadata = {
  metadataBase: new URL(GUIDE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: "ACTTA Studio", url: GUIDE_URL }],
  creator: "ACTTA Studio",
  keywords: siteKeywords,
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: GUIDE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: GUIDE_URL,
  },
};

export function buildDocMetadata(page: DocPage): Metadata {
  const description = page.description ?? `${page.title} — documentation for the ${SITE_NAME}.`;
  const url = new URL(`/${page.slug}`, GUIDE_URL).toString();
  const title = `${page.title} | ${SITE_NAME}`;

  return {
    title: page.title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "article",
      url,
      title,
      description,
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
