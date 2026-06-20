import { defineType, defineField } from 'sanity'
import { LinkIcon } from '@sanity/icons'

export const redirect = defineType({
  name: 'redirect',
  title: 'Redirect',
  type: 'document',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'source',
      title: 'From',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'destination',
      title: 'To',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'permanent',
      title: 'Permanent (301)',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: { source: 'source', destination: 'destination' },
    prepare({ source, destination }) {
      return { title: `${source} → ${destination}` }
    },
  },
})
