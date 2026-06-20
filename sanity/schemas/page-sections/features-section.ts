import { defineType, defineField, defineArrayMember } from 'sanity'
import { ComponentIcon, BoltIcon } from '@sanity/icons'

export const featuresSection = defineType({
  name: 'featuresSection',
  title: 'Features Section',
  type: 'object',
  icon: ComponentIcon,
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
    }),
    defineField({
      name: 'subheadline',
      title: 'Subheadline',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          icon: BoltIcon,
          fields: [
            defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'description', type: 'text', rows: 3 }),
            defineField({
              name: 'icon',
              title: 'Icon name',
              type: 'string',
              description: 'Emoji or icon identifier, e.g. "⚡"',
            }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'description' },
            prepare({ title, subtitle }) {
              return {
                title: title ?? 'Feature',
                subtitle,
                media: BoltIcon,
              }
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'headline' },
    prepare({ title }) {
      return {
        title: title ?? 'Features Section',
        media: ComponentIcon,
      }
    },
  },
})
