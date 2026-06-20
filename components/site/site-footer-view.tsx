'use client'

import type { SiteDocument } from '~/features/sanity/types'

export function SiteFooterView({ site }: { site: SiteDocument | null }) {
  return (
    <footer className="border-t border-(--color-border) bg-(--color-background)">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-8 text-sm text-(--color-muted-foreground) sm:flex-row sm:items-center sm:justify-between">
        <p>{site?.footer ?? `© ${new Date().getFullYear()} ${site?.name ?? 'Site'}`}</p>
        {site?.description && <p className="max-w-md">{site.description}</p>}
      </div>
    </footer>
  )
}
