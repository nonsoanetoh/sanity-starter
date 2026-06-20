import Link from 'next/link'
import { stegaClean } from '@sanity/client/stega'
import { Media } from '~/components/media/Media'
import { ParallaxWrapper } from '~/components/media/ParallaxWrapper'
import { getMediaAspectRatio } from '~/components/media/getMediaAspectRatio'
import type { SanityMedia, SanityCTA } from '~/features/sanity/types'

type HeroSectionProps = {
  _key: string
  documentId: string
  eyebrow?: string | null
  headline?: string | null
  subheadline?: string | null
  media?: SanityMedia | null
  ctas?: SanityCTA[] | null
}

export function HeroSection({ eyebrow, headline, subheadline, media, ctas }: HeroSectionProps) {
  const aspectRatio = media ? getMediaAspectRatio(media) : undefined

  return (
    <section className="relative overflow-hidden py-24 sm:py-32 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          {eyebrow && (
            <p className="text-sm font-semibold uppercase tracking-widest text-(--color-muted-foreground) mb-4">
              {eyebrow}
            </p>
          )}
          {headline && (
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight mb-6">
              {headline}
            </h1>
          )}
          {subheadline && (
            <p className="text-lg text-(--color-muted-foreground) mb-8 leading-relaxed">
              {subheadline}
            </p>
          )}
          {ctas?.length ? (
            <div className="flex flex-wrap gap-3">
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

        {media?.kind && (
          <div
            className="relative rounded-2xl overflow-hidden bg-(--color-muted) w-full"
            style={{ aspectRatio }}
          >
            <ParallaxWrapper enabled={media.useParallax}>
              <Media
                media={media}
                className="absolute inset-0"
                priority
                alt={headline ?? undefined}
              />
            </ParallaxWrapper>
          </div>
        )}
      </div>
    </section>
  )
}
