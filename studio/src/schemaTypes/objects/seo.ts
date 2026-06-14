import { defineType, defineField } from 'sanity'
import { SearchIcon } from '@sanity/icons'

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  icon: SearchIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'SEO title',
      type: 'string',
      validation: (rule) => rule.max(60).warning('Keep under 60 characters for best results'),
    }),
    defineField({
      name: 'description',
      title: 'SEO description',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(155).warning('Keep under 155 characters for best results'),
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph image',
      type: 'image',
      description: 'Recommended: 1200×630px',
    }),
    defineField({
      name: 'noIndex',
      title: 'Hide from search engines',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'title', media: 'ogImage' },
    prepare({ title, media }) {
      return {
        title: title ?? 'SEO',
        media: media ?? SearchIcon,
      }
    },
  },
})
