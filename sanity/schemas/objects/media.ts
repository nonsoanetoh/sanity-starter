import { defineField, defineType } from 'sanity'
import { ImageIcon, ImagesIcon, PlayIcon } from '@sanity/icons'

const ASPECT_RATIO_OPTIONS = [
  { title: 'Natural', value: 'natural' },
  { title: '1:1', value: '1:1' },
  { title: '16:9', value: '16:9' },
  { title: '4:3', value: '4:3' },
  { title: '7:5', value: '7:5' },
  { title: '5:7', value: '5:7' },
]

/**
 * Unified media primitive — image or Mux video.
 * aspectRatio lets editors override the asset's natural dimensions so the
 * frontend can reserve the exact space before the asset loads (no layout shift).
 *
 * Usage: defineField({ name: 'media', type: 'media' })
 */
export const mediaObject = defineType({
  name: 'media',
  title: 'Media',
  type: 'object',
  icon: ImagesIcon,
  fields: [
    // ── Kind ─────────────────────────────────────────────────────────────────
    defineField({
      name: 'kind',
      title: 'Media type',
      type: 'string',
      options: {
        list: [
          { title: 'Image', value: 'image' },
          { title: 'Video', value: 'video' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'image',
      validation: (r) => r.required(),
    }),

    // ── Aspect ratio override ─────────────────────────────────────────────────
    defineField({
      name: 'aspectRatio',
      title: 'Aspect Ratio',
      type: 'string',
      options: {
        list: ASPECT_RATIO_OPTIONS,
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'natural',
      description: 'Override the natural dimensions of the asset',
    }),

    // ── Image ─────────────────────────────────────────────────────────────────
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          validation: (r) => r.required(),
        }),
      ],
      hidden: ({ parent }) => parent?.kind !== 'image',
      validation: (r) =>
        r.custom((value, { parent }) => {
          const p = parent as { kind?: string } | undefined
          if (p?.kind === 'image' && !value) return 'An image is required'
          return true
        }),
    }),

    // ── Video (Mux) ───────────────────────────────────────────────────────────
    defineField({
      name: 'video',
      title: 'Video',
      type: 'mux.video',
      hidden: ({ parent }) => parent?.kind !== 'video',
    }),

    // ── Extras ────────────────────────────────────────────────────────────────
    defineField({
      name: 'useParallax',
      title: 'Use Parallax',
      type: 'boolean',
      description: 'Apply a scroll-driven parallax effect to the media',
      initialValue: false,
    }),
  ],

  preview: {
    select: {
      kind: 'kind',
      image: 'image',
      videoStatus: 'video.asset->status',
    },
    prepare({ kind, image, videoStatus }) {
      if (kind === 'video') {
        return { title: 'Video', subtitle: videoStatus ?? 'No video uploaded', media: PlayIcon }
      }
      return { title: 'Image', media: image ?? ImageIcon }
    },
  },
})
