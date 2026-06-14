import { defineType, defineField, defineArrayMember } from 'sanity'
import { HomeIcon } from '@sanity/icons'

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Internal title',
      type: 'string',
      description: 'Used internally to identify this document',
    }),
    defineField({
      name: 'pageBuilder',
      title: 'Page Builder',
      type: 'array',
      of: [
        defineArrayMember({ type: 'heroSection' }),
        defineArrayMember({ type: 'featuresSection' }),
        defineArrayMember({ type: 'stepsSection' }),
        defineArrayMember({ type: 'ctaSection' }),
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
  ],
  preview: {
    select: { title: 'title' },
    prepare({ title }) {
      return { title: title ?? 'Home Page', media: HomeIcon }
    },
  },
})
