import { defineType, defineField, defineArrayMember } from 'sanity'
import { PresentationIcon } from '@sanity/icons'

export const heroSection = defineType({
  name: 'heroSection',
  title: 'Hero Section',
  type: 'object',
  icon: PresentationIcon,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow text',
      type: 'string',
      description: 'Small label above the headline',
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'subheadline',
      title: 'Subheadline',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'media',
      title: 'Media',
      type: 'media',
      description: 'Image or Mux video shown alongside the headline',
    }),
    defineField({
      name: 'ctas',
      title: 'Call to actions',
      type: 'array',
      of: [defineArrayMember({ type: 'callToAction' })],
      validation: (rule) => rule.max(2),
    }),
  ],
  preview: {
    select: { title: 'headline', image: 'media.image' },
    prepare({ title, image }) {
      return {
        title: title ?? 'Hero Section',
        media: image ?? PresentationIcon,
      }
    },
  },
})
