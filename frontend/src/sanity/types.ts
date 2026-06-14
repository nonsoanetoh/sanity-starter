/**
 * Shared TypeScript types for Sanity data shapes used across components.
 * These mirror the GROQ projections in queries.ts — update both together.
 */

export type SanityImage = {
  asset?: {
    _id?: string | null
    url?: string | null
    metadata?: {
      dimensions?: {
        width?: number | null
        height?: number | null
        aspectRatio?: number | null
      } | null
      lqip?: string | null
    } | null
  } | null
  alt?: string | null
  hotspot?: { x?: number; y?: number } | null
  crop?: { top?: number; bottom?: number; left?: number; right?: number } | null
}

export type SanityMuxVideo = {
  playbackId?: string | null
  aspectRatio?: string | null
  duration?: number | null
  status?: string | null
}

/**
 * Unified media primitive — image or Mux video.
 * aspectRatio overrides the natural asset dimensions ('natural' = use asset dims).
 * useParallax enables a scroll-driven parallax effect on the frontend.
 */
export type SanityMedia = {
  kind?: 'image' | 'video' | null
  aspectRatio?: 'natural' | '1:1' | '16:9' | '4:3' | '7:5' | '5:7' | null
  useParallax?: boolean | null
  image?: SanityImage | null
  video?: SanityMuxVideo | null
}

/**
 * Resolved link — the GROQ projection flattens internal/external into a
 * plain href string so components never need to branch on linkType.
 */
export type SanityLink = {
  href?: string | null
  blank?: boolean | null
}

export type SanityCTA = SanityLink & {
  _key?: string | null
  label?: string | null
  variant?: string | null
}

export type SanityNavLink = SanityLink & {
  label?: string | null
}
