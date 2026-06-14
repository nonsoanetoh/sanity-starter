'use client'

import { useState } from 'react'
import Link from 'next/link'
import { stegaClean } from '@sanity/client/stega'
import type { SanityNavLink } from '@/sanity/types'

export function NavMobile({ links, siteName }: { links: SanityNavLink[]; siteName: string | null }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Hamburger button — 44×44px hit area */}
      <button
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-11 w-11 items-center justify-center rounded-lg md:hidden"
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        <span
          className="absolute block h-[1.5px] w-5 bg-current transition-[transform,opacity] duration-200"
          style={{
            transform: open ? 'translateY(0) rotate(45deg)' : 'translateY(-4px)',
            transitionTimingFunction: 'cubic-bezier(0.2, 0, 0, 1)',
          }}
        />
        <span
          className="absolute block h-[1.5px] w-5 bg-current transition-[transform,opacity] duration-200"
          style={{
            opacity: open ? 0 : 1,
            transitionTimingFunction: 'cubic-bezier(0.2, 0, 0, 1)',
          }}
        />
        <span
          className="absolute block h-[1.5px] w-5 bg-current transition-[transform,opacity] duration-200"
          style={{
            transform: open ? 'translateY(0) rotate(-45deg)' : 'translateY(4px)',
            transitionTimingFunction: 'cubic-bezier(0.2, 0, 0, 1)',
          }}
        />
      </button>

      {/* Mobile drawer */}
      <div
        aria-hidden={!open}
        className="absolute inset-x-0 top-full border-b border-[var(--color-border)] bg-[var(--color-background)] px-4 pb-6 pt-4 md:hidden"
        style={{
          opacity: open ? 1 : 0,
          transform: open ? 'translateY(0)' : 'translateY(-8px)',
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 200ms cubic-bezier(0.2,0,0,1), transform 200ms cubic-bezier(0.2,0,0,1)',
        }}
      >
        <nav className="flex flex-col gap-1">
          {links.map((link, i) => {
            const href = stegaClean(link.href)
            if (!href) return null
            return (
              <Link
                key={i}
                href={href}
                target={link.blank ? '_blank' : undefined}
                rel={link.blank ? 'noopener noreferrer' : undefined}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150 hover:bg-[var(--color-muted)]"
              >
                {link.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  )
}
