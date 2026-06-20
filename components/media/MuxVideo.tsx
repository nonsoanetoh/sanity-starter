'use client'

import MuxPlayer from '@mux/mux-player-react'
import type { SanityMuxVideo } from '~/features/sanity/types'

type Props = {
  video: SanityMuxVideo
  className?: string
}

export function MuxVideo({ video, className }: Props) {
  if (!video.playbackId) return null

  const rawRatio = video.aspectRatio
  const aspectRatio =
    typeof rawRatio === 'string'
      ? rawRatio.replace(':', '/')
      : typeof rawRatio === 'number'
        ? `${rawRatio}/1`
        : '16/9'

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
