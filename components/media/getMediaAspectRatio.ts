import type { SanityMedia } from '~/features/sanity/types'

const RATIO_MAP: Record<string, string> = {
  '1:1': '1/1',
  '16:9': '16/9',
  '4:3': '4/3',
  '7:5': '7/5',
  '5:7': '5/7',
}

/**
 * Returns a CSS `aspect-ratio` string for the media container.
 *
 * Priority:
 *   1. CMS override (anything other than "natural")
 *   2. Natural asset dimensions (image metadata or Mux aspect_ratio)
 *   3. "1/1" fallback so the container always has a height
 *
 * Plain function — no hooks, safe to call in Server Components.
 */
export function getMediaAspectRatio(media: SanityMedia | null | undefined): string {
  if (!media) return '1/1'

  // 1. CMS override
  if (media.aspectRatio && media.aspectRatio !== 'natural') {
    return RATIO_MAP[media.aspectRatio] ?? '1/1'
  }

  // 2. Natural asset dimensions
  if (media.kind === 'image') {
    const dims = media.image?.asset?.metadata?.dimensions
    if (dims?.width && dims?.height) return `${dims.width}/${dims.height}`
  }

  if (media.kind === 'video') {
    const ratio = media.video?.aspectRatio
    if (typeof ratio === 'string') return ratio.replace(':', '/')
    if (typeof ratio === 'number') return `${ratio}/1`
    return '16/9'
  }

  // 3. Fallback
  return '1/1'
}
