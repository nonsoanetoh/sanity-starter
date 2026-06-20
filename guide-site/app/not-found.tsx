import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-muted-foreground)]">
        404
      </p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-[var(--color-muted-foreground)]">
        This documentation page does not exist or may have moved.
      </p>
      <Link href="/" className="mt-8 guide-btn-primary">
        Back to guide home
      </Link>
    </main>
  );
}
