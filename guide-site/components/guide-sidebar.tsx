"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SITE_NAME } from "~/lib/constants";
import { navChapters } from "~/lib/nav";

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="space-y-7">
      {navChapters.map((chapter) => (
        <div key={chapter.title}>
          <p className="mb-2.5 px-3 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-muted-foreground)]">
            {chapter.title}
          </p>
          <ul className="space-y-0.5">
            {chapter.pages.map((page) => {
              const href = `/${page.slug}`;
              const isActive = pathname === href;
              return (
                <li key={page.slug}>
                  <Link
                    href={href}
                    onClick={onNavigate}
                    className={`guide-nav-link ${
                      isActive
                        ? "guide-nav-link-active"
                        : "text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]"
                    }`}
                  >
                    {page.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      <div className="shrink-0 border-b px-5 py-5">
        <Link
          href="/"
          className="group block transition-opacity duration-[var(--duration-normal)] hover:opacity-80"
          onClick={onNavigate}
        >
          <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-muted-foreground)]">
            ACTTA Guide
          </span>
          <span className="mt-1.5 block text-[0.9375rem] font-semibold leading-snug tracking-tight text-[var(--color-foreground)]">
            {SITE_NAME}
          </span>
        </Link>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-5">
        <NavLinks onNavigate={onNavigate} />
      </div>
    </>
  );
}

export function GuideSidebar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="fixed left-4 top-4 z-50 flex h-10 items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-sm font-medium shadow-sm backdrop-blur-sm transition-[transform,box-shadow] duration-[var(--duration-normal)] ease-[var(--ease-out)] hover:shadow-md active:scale-[0.98] lg:hidden"
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
        aria-expanded={open}
      >
        <span className="flex flex-col gap-1">
          <span className="block h-0.5 w-4 rounded-full bg-current" />
          <span className="block h-0.5 w-4 rounded-full bg-current" />
        </span>
        Menu
      </button>

      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px] transition-opacity duration-[var(--duration-normal)] ease-[var(--ease-out)] lg:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(18rem,88vw)] flex-col border-r bg-[var(--color-sidebar)]/95 shadow-xl backdrop-blur-md transition-transform duration-[var(--duration-normal)] ease-[var(--ease-out)] lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!open}
      >
        <SidebarContent onNavigate={() => setOpen(false)} />
      </aside>

      <aside className="hidden w-72 shrink-0 lg:block">
        <div className="sticky top-0 flex h-screen flex-col border-r bg-[var(--color-sidebar)]/80 backdrop-blur-md">
          <SidebarContent />
        </div>
      </aside>
    </>
  );
}
