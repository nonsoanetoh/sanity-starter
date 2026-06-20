import Image from 'next/image'
import { urlFor } from '~/features/sanity/image'
import { MuxVideo } from './MuxVideo'
import type { SanityMedia } from '~/features/sanity/types'

type Props = {
  media?: SanityMedia | null
  className?: string
  priority?: boolean
  alt?: string
}

/**
 * Pure media renderer — fills whatever container it's placed in.
 *
 * The CALLER is responsible for sizing the container and setting its
 * aspect-ratio (use `getMediaAspectRatio` to compute the right value).
 * Parallax is handled by wrapping in <ParallaxWrapper enabled={media.useParallax}>.
 */
export function Media({ media, className = '', priority, alt }: Props) {
  if (!media?.kind) return null

  switch (media.kind) {
    case 'image': {
      const img = media.image
      if (!img?.asset) return null
      return (
        <div className={`relative w-full h-full ${className}`}>
          <Image
            src={urlFor(img).width(1200).url()}
            alt={img.alt ?? alt ?? ''}
            fill
            className="object-cover"
            priority={priority}
            placeholder={img.asset.metadata?.lqip ? 'blur' : 'empty'}
            blurDataURL={img.asset.metadata?.lqip ?? undefined}
          />
        </div>
      )
    }

    case 'video': {
      const vid = media.video
      if (!vid?.playbackId) return null
      return <MuxVideo video={vid} className={className} />
    }

    default:
      return null
  }
}
