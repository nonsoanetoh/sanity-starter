import Link from "next/link";
import { PageSections } from "~/features/page-builder/page-sections";
import { sanityFetch } from "~/features/sanity/fetch";
import { SITE_QUERY } from "~/features/sanity/queries";
import type { SiteDocument } from "~/features/sanity/types";

export default async function WebNotFound() {
  const site = await sanityFetch<SiteDocument>({
    query: SITE_QUERY,
    options: { next: { tags: ["site"] } },
  });

  const notFoundDocId = site?.notFoundPage?._id;

  if (notFoundDocId) {
    return <PageSections docId={notFoundDocId} />;
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-4 text-(--color-muted-foreground)">Page not found</p>
      <Link href="/" className="mt-8 text-sm font-medium underline underline-offset-4">
        Back to {site?.name ?? "home"}
      </Link>
    </div>
  );
}
