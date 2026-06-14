import Link from 'next/link'
import { stegaClean } from '@sanity/client/stega'
import { sanityFetch } from '@/sanity/live'
import { SETTINGS_QUERY } from '@/sanity/queries'

export async function Footer() {
  const { data: settings } = await sanityFetch({ query: SETTINGS_QUERY })

  const siteName = settings?.siteName ?? 'Site'
  const navLinks = settings?.navLinks ?? []
  const footerText = settings?.footer

  return (
    <footer className="border-t border-(--color-border) bg-(--color-background)">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">

          {/* Brand */}
          <div className="flex flex-col gap-2">
            <Link
              href="/"
              className="font-semibold tracking-tight transition-opacity hover:opacity-80"
            >
              {siteName}
            </Link>
            {footerText && (
              <p className="max-w-xs text-sm text-(--color-muted-foreground) text-pretty">
                {footerText}
              </p>
            )}
          </div>

          {/* Nav links */}
          {navLinks.length > 0 && (
            <nav className="flex flex-wrap gap-x-6 gap-y-2">
              {navLinks.map((link, i) => {
                const href = stegaClean(link.href)
                if (!href) return null
                return (
                  <Link
                    key={i}
                    href={href}
                    target={link.blank ? '_blank' : undefined}
                    rel={link.blank ? 'noopener noreferrer' : undefined}
                    className="text-sm text-(--color-muted-foreground) transition-colors duration-150 hover:text-(--color-foreground)"
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>
          )}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-(--color-border) pt-6">
          <p className="text-xs text-(--color-muted-foreground) [font-variant-numeric:tabular-nums]">
            © {new Date().getFullYear()} {siteName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
