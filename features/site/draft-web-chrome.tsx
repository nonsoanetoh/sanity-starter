'use client'

import { KeyboardFocusMode } from '~/features/dom/keyboard-focus-mode'
import type { SiteDocument } from '~/features/sanity/types'
import { SiteFooterView } from '~/components/site/site-footer-view'
import { SiteHeaderView } from '~/components/site/site-header-view'

/**
 * Draft preview shell — site data is passed once from the server and does not
 * re-fetch when page content updates over Comlink.
 */
export function DraftWebChrome({
  site,
  children,
}: {
  site: SiteDocument | null
  children: React.ReactNode
}) {
  return (
    <>
      <KeyboardFocusMode />
      <div className="flex min-h-screen flex-col">
        <SiteHeaderView site={site} />
        <main className="flex-1">{children}</main>
        <SiteFooterView site={site} />
      </div>
    </>
  )
}
