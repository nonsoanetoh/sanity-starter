import { defineField } from 'sanity'

type MediaFieldOptions = {
  group?: string
  name?: string
  withParallax?: boolean
}

export function createMediaField({
  group,
  name = 'media',
  withParallax = true,
}: MediaFieldOptions = {}) {
  return defineField({
    name,
    title: 'Media',
    type: 'media',
    group,
    description: withParallax
      ? 'Image or Mux video. Optional parallax scroll effect.'
      : 'Image or Mux video.',
  })
}
