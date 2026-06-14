import Link from "next/link";
import Image from "next/image";
import { stegaClean } from "@sanity/client/stega";
import { sanityFetch } from "@/sanity/live";
import { SETTINGS_QUERY } from "@/sanity/queries";
import { NavMobile } from "./NavMobile";

export async function Nav() {
  const { data: settings } = await sanityFetch({ query: SETTINGS_QUERY });

  const siteName = settings?.siteName ?? "Site";
  const navLinks = settings?.navLinks ?? [];

  return (
    <header className="relative border-b border-(--color-border) bg-(--color-background)">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        {/* Logo / site name */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-semibold tracking-tight transition-opacity hover:opacity-80"
        >
          {settings?.logo?.asset?.url ? (
            <Image
              src={settings.logo.asset.url}
              alt={stegaClean(settings.logo.alt) ?? siteName}
              width={settings.logo.asset.metadata?.dimensions?.width ?? 120}
              height={settings.logo.asset.metadata?.dimensions?.height ?? 32}
              className="h-8 w-auto object-contain"
              priority
            />
          ) : (
            <span>{siteName}</span>
          )}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link, i) => {
            const href = stegaClean(link.href);
            if (!href) return null;
            return (
              <Link
                key={i}
                href={href}
                target={link.blank ? "_blank" : undefined}
                rel={link.blank ? "noopener noreferrer" : undefined}
                className="rounded-lg px-3 py-2 text-sm font-medium text-(--color-muted-foreground) transition-colors duration-150 hover:bg-(--color-muted) hover:text-(--color-foreground)"
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile toggle (client component) */}
        <NavMobile links={navLinks} siteName={siteName} />
      </div>
    </header>
  );
}
