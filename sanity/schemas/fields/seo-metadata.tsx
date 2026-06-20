import { defineType, defineField } from 'sanity'
import { SearchIcon } from '@sanity/icons'

export const seoMetadata = defineType({
  name: 'seoMetadata',
  title: 'SEO Metadata',
  type: 'object',
  icon: SearchIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'SEO title',
      type: 'string',
      validation: (rule) => rule.max(60).warning('Keep under 60 characters'),
    }),
    defineField({
      name: 'description',
      title: 'SEO description',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(155).warning('Keep under 155 characters'),
    }),
    defineField({
      name: 'image',
      title: 'Open Graph image',
      type: 'image',
      options: { hotspot: true },
      description: 'Recommended: 1200×630px',
    }),
    defineField({
      name: 'noIndex',
      title: 'Hide from search engines',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})

export function createSeoMetadataField({ group }: { group?: string } = {}) {
  return defineField({
    name: 'seoMetadata',
    title: 'SEO',
    type: 'seoMetadata',
    group,
  })
}
