import type { Metadata } from 'next'
import { sanityFetch } from '~/features/sanity/fetch'
import { SITE_QUERY } from '~/features/sanity/queries'
import { getOgImageSrc } from '~/features/sanity/image'
import type { SanityImage } from '~/features/sanity/types'
import { env } from '~/env'

type SeoInput = {
  title?: string | null
  description?: string | null
  image?: SanityImage | null
  canonical?: string | null
  robots?: Metadata['robots']
}

export async function seo(input: SeoInput = {}): Promise<Metadata> {
  const site = await sanityFetch<{
    name?: string | null
    seoMetadata?: {
      title?: string | null
      description?: string | null
      image?: SanityImage | null
      noIndex?: boolean | null
    } | null
  }>({
    query: SITE_QUERY,
    options: { next: { tags: ['site'] }, stega: false },
  })

  const title = input.title ?? site?.seoMetadata?.title ?? site?.name ?? undefined
  const description = input.description ?? site?.seoMetadata?.description ?? undefined
  const image = input.image ?? site?.seoMetadata?.image
  const ogImage = image ? getOgImageSrc(image) : undefined

  return {
    title,
    description,
    robots: input.robots ?? (site?.seoMetadata?.noIndex ? { index: false } : undefined),
    openGraph: {
      siteName: site?.name ?? undefined,
      title: title ?? undefined,
      description: description ?? undefined,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : [],
    },
    alternates: {
      canonical: input.canonical ?? env.NEXT_PUBLIC_URL,
    },
  }
}
