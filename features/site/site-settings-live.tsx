"use client";

import { usePresentationQuery } from "next-sanity/hooks";
import { SiteFooterView } from "~/components/site/site-footer-view";
import { SiteHeaderView } from "~/components/site/site-header-view";
import { KeyboardFocusMode } from "~/features/dom/keyboard-focus-mode";
import { SITE_QUERY } from "~/features/sanity/queries";
import type { SiteDocument } from "~/features/sanity/types";

type Props = {
  initialSite: SiteDocument | null;
  children: React.ReactNode;
};

export function SiteSettingsLive({ initialSite, children }: Props) {
  const { data } = usePresentationQuery({
    query: SITE_QUERY,
  });

  const site = (data ?? initialSite) as SiteDocument | null;

  return (
    <>
      <KeyboardFocusMode />
      <div className="flex min-h-screen flex-col">
        <SiteHeaderView site={site} />
        <main className="flex-1">{children}</main>
        <SiteFooterView site={site} />
      </div>
    </>
  );
}
