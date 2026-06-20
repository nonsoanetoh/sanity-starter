import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GuideSidebar } from "~/components/guide-sidebar";
import { BRAND_COLOR } from "~/lib/constants";
import { siteMetadata } from "~/lib/metadata";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = siteMetadata;

export const viewport: Viewport = {
  themeColor: BRAND_COLOR,
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}>
        <div className="relative min-h-screen bg-[radial-gradient(ellipse_at_top,_oklch(0.18_0.05_145)_0%,_var(--color-background)_50%)]">
          <div className="flex min-h-screen">
            <GuideSidebar />
            <div className="flex min-w-0 flex-1 flex-col">{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
