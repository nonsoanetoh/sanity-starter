import Link from "next/link";
import type { DocPage } from "~/lib/nav";

function Arrow({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 16 16"
      className={`h-4 w-4 text-[var(--color-muted-foreground)] transition-transform duration-[var(--duration-normal)] ease-[var(--ease-out)] group-hover/pager:text-[var(--color-primary)] ${
        direction === "right"
          ? "group-hover/pager:translate-x-0.5"
          : "group-hover/pager:-translate-x-0.5"
      }`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      {direction === "left" ? (
        <path d="M10 3 5 8l5 5" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M6 3l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

export function DocPager({ prev, next }: { prev: DocPage | null; next: DocPage | null }) {
  if (!prev && !next) return null;

  return (
    <nav className="mt-14 grid gap-3 border-t pt-8 sm:grid-cols-2">
      {prev ? (
        <Link
          href={`/${prev.slug}`}
          className="group/pager guide-surface flex items-start gap-3 p-4 transition-[transform,box-shadow,border-color] duration-[var(--duration-normal)] ease-[var(--ease-out)] hover:-translate-y-0.5 hover:border-[var(--color-primary-soft)] hover:shadow-[0_8px_24px_oklch(0_0_0_/_0.4)]"
        >
          <Arrow direction="left" />
          <div>
            <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-muted-foreground)]">
              Previous
            </span>
            <span className="mt-1 block text-sm font-medium transition-colors group-hover/pager:text-[var(--color-primary)]">
              {prev.title}
            </span>
          </div>
        </Link>
      ) : (
        <div className="hidden sm:block" />
      )}
      {next ? (
        <Link
          href={`/${next.slug}`}
          className="group/pager guide-surface flex items-start justify-end gap-3 p-4 text-right transition-[transform,box-shadow,border-color] duration-[var(--duration-normal)] ease-[var(--ease-out)] hover:-translate-y-0.5 hover:border-[var(--color-primary-soft)] hover:shadow-[0_8px_24px_oklch(0_0_0_/_0.4)] sm:col-start-2"
        >
          <div>
            <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-muted-foreground)]">
              Next
            </span>
            <span className="mt-1 block text-sm font-medium transition-colors group-hover/pager:text-[var(--color-primary)]">
              {next.title}
            </span>
          </div>
          <Arrow direction="right" />
        </Link>
      ) : null}
    </nav>
  );
}
