'use client'

import Image from 'next/image'
import Link from 'next/link'
import { stegaClean } from '@sanity/client/stega'
import { NavMobile } from '~/components/layout/NavMobile'
import type { SiteDocument } from '~/features/sanity/types'

export function SiteHeaderView({ site }: { site: SiteDocument | null }) {
  const siteName = site?.name ?? 'Site'
  const navLinks = site?.navLinks ?? []

  return (
    <header className="relative border-b border-(--color-border) bg-(--color-background)">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-semibold tracking-tight transition-opacity hover:opacity-80"
        >
          {site?.logo?.asset?.url ? (
            <Image
              src={site.logo.asset.url}
              alt={stegaClean(site.logo.alt) ?? siteName}
              width={site.logo.asset.metadata?.dimensions?.width ?? 120}
              height={site.logo.asset.metadata?.dimensions?.height ?? 32}
              className="h-8 w-auto object-contain"
              priority
            />
          ) : (
            <span>{siteName}</span>
          )}
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link, i) => {
            const href = stegaClean(link.href)
            if (!href) return null
            return (
              <Link
                key={i}
                href={href}
                target={link.blank ? '_blank' : undefined}
                rel={link.blank ? 'noopener noreferrer' : undefined}
                className="rounded-lg px-3 py-2 text-sm font-medium text-(--color-muted-foreground) transition-colors duration-150 hover:bg-(--color-muted) hover:text-(--color-foreground)"
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <NavMobile links={navLinks} siteName={siteName} />
      </div>
    </header>
  )
}
