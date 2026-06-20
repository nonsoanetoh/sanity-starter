"use client";

import { useEffect, useState } from "react";
import type { DocHeading } from "~/lib/docs";

export function GuideToc({ headings }: { headings: DocHeading[] }) {
  const tocHeadings = headings.filter((h) => h.level <= 3);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (tocHeadings.length < 2) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 },
    );

    for (const heading of tocHeadings) {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    }

    return () => observer.disconnect();
  }, [tocHeadings]);

  if (tocHeadings.length < 2) return null;

  return (
    <aside className="hidden xl:block">
      <div className="sticky top-10">
        <p className="mb-4 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-muted-foreground)]">
          On this page
        </p>
        <ul className="space-y-1 border-l border-[var(--color-border)] pl-4">
          {tocHeadings.map((heading) => {
            const isActive = activeId === heading.id;
            return (
              <li key={heading.id} className={heading.level === 3 ? "pl-2" : undefined}>
                <a
                  href={`#${heading.id}`}
                  className={`block py-1 text-[0.8125rem] leading-snug transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] ${
                    isActive
                      ? "font-medium text-[var(--color-primary)]"
                      : "text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
                  }`}
                >
                  {heading.text}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
