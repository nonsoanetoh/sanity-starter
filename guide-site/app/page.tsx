import type { Metadata } from "next";
import Link from "next/link";
import { GUIDE_URL, REPO_URL, SITE_DESCRIPTION, SITE_NAME } from "~/lib/constants";
import { siteMetadata } from "~/lib/metadata";
import { navChapters } from "~/lib/nav";

export const metadata: Metadata = {
  ...siteMetadata,
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: GUIDE_URL,
  },
  openGraph: {
    ...siteMetadata.openGraph,
    url: GUIDE_URL,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    ...siteMetadata.twitter,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

export default function GuideHomePage() {
  return (
    <main className="flex-1 px-6 py-10 pt-20 lg:px-12 lg:py-14 lg:pt-14">
      <div className="mx-auto max-w-3xl">
        <div className="guide-fade-in">
          <p className="text-sm font-medium text-[var(--color-primary)]">Documentation</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            {SITE_NAME}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--color-muted-foreground)]">
            A production-ready Sanity + Next.js starter with embedded Studio, catch-all routing,
            cache tags, webhooks, live preview, and optional analytics and form notifications.
          </p>
        </div>

        <div className="guide-fade-in guide-fade-in-delay-1 mt-9 flex flex-wrap gap-3">
          <Link href="/getting-started" className="guide-btn-primary">
            Getting started
          </Link>
          <Link href="/faq" className="guide-btn-secondary">
            FAQ
          </Link>
          {REPO_URL && (
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="guide-btn-secondary"
            >
              View on GitHub
            </a>
          )}
        </div>

        <div className="guide-fade-in guide-fade-in-delay-2 mt-16 grid gap-4 sm:grid-cols-2">
          {navChapters.map((chapter, index) => {
            const firstPage = chapter.pages[0];
            return (
              <section
                key={chapter.title}
                className="guide-surface p-6 transition-[transform,box-shadow,border-color] duration-[var(--duration-normal)] ease-[var(--ease-out)] hover:-translate-y-1 hover:border-[var(--color-primary-soft)] hover:shadow-[0_12px_32px_oklch(0_0_0_/_0.45)]"
                style={{ animationDelay: `${180 + index * 40}ms` }}
              >
                <h2 className="text-base font-semibold tracking-tight">{chapter.title}</h2>
                <ul className="mt-4 space-y-2">
                  {chapter.pages.map((page) => (
                    <li key={page.slug}>
                      <Link
                        href={`/${page.slug}`}
                        className="text-sm text-[var(--color-muted-foreground)] transition-colors duration-[var(--duration-fast)] hover:text-[var(--color-primary)]"
                      >
                        {page.title}
                      </Link>
                    </li>
                  ))}
                </ul>
                {firstPage && (
                  <Link
                    href={`/${firstPage.slug}`}
                    className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-[var(--color-primary)] transition-[gap] duration-[var(--duration-normal)] ease-[var(--ease-out)] hover:gap-2"
                  >
                    Start with {firstPage.title}
                    <span aria-hidden>→</span>
                  </Link>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
