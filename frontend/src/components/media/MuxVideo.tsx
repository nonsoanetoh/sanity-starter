'use client'

import MuxPlayer from '@mux/mux-player-react'
import type { SanityMuxVideo } from '@/sanity/types'

type Props = {
  video: SanityMuxVideo
  className?: string
}

export function MuxVideo({ video, className }: Props) {
  if (!video.playbackId) return null

  // Mux uses "16:9" format; CSS aspect-ratio uses "16/9"
  const aspectRatio = video.aspectRatio?.replace(':', '/') ?? '16/9'

  return (
    <div style={{ aspectRatio }} className={className}>
      <MuxPlayer
        playbackId={video.playbackId}
        style={{ width: '100%', height: '100%' }}
        streamType="on-demand"
      />
    </div>
  )
}
