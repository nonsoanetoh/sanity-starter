import Link from 'next/link'
import { stegaClean } from '@sanity/client/stega'
import type { SanityCTA } from '~/features/sanity/types'

type CtaSectionProps = {
  _key: string
  documentId: string
  headline?: string | null
  subheadline?: string | null
  ctas?: SanityCTA[] | null
}

export function CtaSection({ headline, subheadline, ctas }: CtaSectionProps) {
  return (
    <section className="py-24 px-4 border-t border-(--color-border)">
      <div className="max-w-2xl mx-auto text-center rounded-2xl border border-(--color-border) bg-(--color-muted)/40 px-8 py-14">
        {headline && (
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">{headline}</h2>
        )}
        {subheadline && (
          <p className="text-(--color-muted-foreground) leading-relaxed mb-8">{subheadline}</p>
        )}
        {ctas?.length ? (
          <div className="flex flex-wrap items-center justify-center gap-3">
            {ctas.map((cta, i) => {
              const variant = stegaClean(cta.variant) ?? 'primary'
              const href = cta.href ?? '#'
              const isExternal = cta.blank
              return (
                <Link
                  key={cta._key ?? i}
                  href={href}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  className={
                    variant === 'primary'
                      ? 'inline-flex items-center rounded-lg bg-(--color-primary) text-(--color-primary-foreground) px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-90'
                      : variant === 'secondary'
                        ? 'inline-flex items-center rounded-lg border border-(--color-border) bg-transparent px-5 py-2.5 text-sm font-medium transition-colors hover:bg-(--color-muted)'
                        : 'inline-flex items-center px-5 py-2.5 text-sm font-medium underline underline-offset-4 hover:no-underline'
                  }
                >
                  {cta.label}
                </Link>
              )
            })}
          </div>
        ) : null}
      </div>
    </section>
  )
}
