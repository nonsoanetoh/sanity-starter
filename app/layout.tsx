import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { UmamiScript } from "~/components/umami-script";
import { sanityFetch } from "~/features/sanity/fetch";
import { urlFor } from "~/features/sanity/image";
import type { SanityImage } from "~/features/sanity/types";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const FAVICON_QUERY = `*[_type == "site"][0].favicon{
  asset->{ url },
  alt
}`;

export async function generateMetadata(): Promise<Metadata> {
  const favicon = await sanityFetch<SanityImage | null>({
    query: FAVICON_QUERY,
    options: { next: { tags: ["site"] }, stega: false },
  });

  const faviconUrl = favicon?.asset?.url ? urlFor(favicon).width(32).height(32).url() : undefined;

  return {
    title: {
      default: "Actta Studio",
      template: "%s | Actta Studio",
    },
    ...(faviconUrl ? { icons: { icon: faviconUrl } } : {}),
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <UmamiScript />
      </body>
    </html>
  );
}
