import { draftMode } from "next/headers";
import { DisableDraftMode } from "~/components/disable-draft-mode";
import { DraftVisualEditing } from "~/components/draft-visual-editing";
import { KeyboardFocusMode } from "~/features/dom/keyboard-focus-mode";
import { LenisProvider } from "~/features/lenis";
import { sanityFetch } from "~/features/sanity/fetch";
import { SITE_QUERY } from "~/features/sanity/queries";
import { SanityLiveRoot } from "~/features/sanity/sanity-live-root";
import type { SiteDocument } from "~/features/sanity/types";
import { SiteFooter } from "~/features/site/site-footer";
import { SiteHeader } from "~/features/site/site-header";
import { SiteSettingsLive } from "~/features/site/site-settings-live";
import { AppViewTransitions } from "~/features/view-transitions/app-view-transitions";

function ProductionChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <KeyboardFocusMode />
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>
    </>
  );
}

async function DraftPreviewExtras() {
  const { isEnabled: isDraftMode } = await draftMode();
  if (!isDraftMode) return null;

  return (
    <>
      <DraftVisualEditing />
      <DisableDraftMode />
    </>
  );
}

export default async function WebLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled: isDraftMode } = await draftMode();

  if (isDraftMode) {
    const site = await sanityFetch<SiteDocument>({
      query: SITE_QUERY,
    });

    return (
      <>
        <SiteSettingsLive initialSite={site}>{children}</SiteSettingsLive>
        <SanityLiveRoot />
        <DraftPreviewExtras />
      </>
    );
  }

  return (
    <>
      <AppViewTransitions>
        <LenisProvider>
          <ProductionChrome>{children}</ProductionChrome>
        </LenisProvider>
      </AppViewTransitions>
      <SanityLiveRoot />
    </>
  );
}
