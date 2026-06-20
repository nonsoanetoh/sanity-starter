export type SanityImage = {
  asset?: {
    _id?: string
    url?: string
    metadata?: {
      dimensions?: { width?: number; height?: number; aspectRatio?: number }
      lqip?: string
    }
  }
  alt?: string | null
  hotspot?: unknown
  crop?: unknown
}

export type SanityMedia = {
  kind?: 'image' | 'video' | null
  aspectRatio?: string | null
  useParallax?: boolean | null
  image?: SanityImage | null
  video?: {
    playbackId?: string | null
    aspectRatio?: number | string | null
    duration?: number | null
    status?: string | null
  } | null
}

export type SanityMuxVideo = NonNullable<SanityMedia['video']>

export type SanityCTA = {
  _key?: string
  label?: string | null
  href?: string | null
  blank?: boolean | null
  variant?: string | null
}

export type NavLink = {
  label?: string | null
  href?: string | null
  blank?: boolean | null
}

export type SanityNavLink = NavLink

export type SiteDocument = {
  name?: string | null
  description?: string | null
  logo?: SanityImage | null
  favicon?: SanityImage | null
  navLinks?: NavLink[] | null
  footer?: string | null
  seoMetadata?: {
    title?: string | null
    description?: string | null
    image?: SanityImage | null
    noIndex?: boolean | null
  } | null
}

export type PageDocument = {
  _id: string
  title?: string | null
  uri?: string | null
  passwordProtected?: boolean | null
  sections?: unknown[] | null
  seoMetadata?: SiteDocument['seoMetadata']
}

export type ArticleDocument = {
  _id: string
  title?: string | null
  slug?: string | null
  passwordProtected?: boolean | null
  excerpt?: string | null
  coverImage?: SanityImage | null
  publishedAt?: string | null
  body?: unknown
  seoMetadata?: SiteDocument['seoMetadata']
}
