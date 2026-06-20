import { defineType, defineField, defineArrayMember } from 'sanity'
import { TaskIcon } from '@sanity/icons'

export const stepsSection = defineType({
  name: 'stepsSection',
  title: 'Steps Section',
  type: 'object',
  icon: TaskIcon,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow text',
      type: 'string',
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
      rows: 2,
    }),
    defineField({
      name: 'steps',
      title: 'Steps',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          icon: TaskIcon,
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3,
            }),
            defineField({
              name: 'code',
              title: 'Command or code snippet',
              type: 'string',
              description: 'Optional — shown in a monospace block for copy-paste',
            }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'description' },
            prepare({ title, subtitle }) {
              return { title, subtitle, media: TaskIcon }
            },
          },
        }),
      ],
      validation: (rule) => rule.min(1).error('Add at least one step'),
    }),
  ],
  preview: {
    select: { title: 'headline', count: 'steps' },
    prepare({ title, count }) {
      const n = Array.isArray(count) ? count.length : 0
      return {
        title: title ?? 'Steps Section',
        subtitle: n ? `${n} step${n === 1 ? '' : 's'}` : 'No steps',
        media: TaskIcon,
      }
    },
  },
})
