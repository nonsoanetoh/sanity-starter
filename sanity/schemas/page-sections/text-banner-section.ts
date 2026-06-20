import { defineField, defineType } from 'sanity'
import { TextIcon } from '@sanity/icons'

export const textBannerSection = defineType({
  name: 'textBannerSection',
  title: 'Text Banner Section',
  type: 'object',
  icon: TextIcon,
  fields: [
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
  ],
  preview: {
    select: { title: 'headline' },
    prepare({ title }) {
      return { title: title ?? 'Text Banner Section', media: TextIcon }
    },
  },
})
