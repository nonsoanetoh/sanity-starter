import { defineField, defineType, defineArrayMember } from 'sanity'
import { DocumentTextIcon } from '@sanity/icons'
import { createSeoMetadataField } from '../fields/seo-metadata'

export const article = defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    { name: 'article', title: 'Article', default: true },
    { name: 'content', title: 'Content' },
    { name: 'meta', title: 'Meta' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      group: 'article',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      group: 'article',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
      group: 'article',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'passwordProtected',
      type: 'boolean',
      group: 'article',
      title: 'Password protect',
      initialValue: false,
    }),
    defineField({
      name: 'excerpt',
      type: 'text',
      group: 'content',
      rows: 3,
      validation: (r) => r.max(200),
    }),
    defineField({
      name: 'coverImage',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', type: 'string', validation: (r) => r.required() })],
    }),
    defineField({
      name: 'body',
      type: 'blockContent',
      group: 'content',
    }),
    defineField({
      name: 'categories',
      type: 'array',
      group: 'meta',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'articleCategory' }] })],
    }),
    createSeoMetadataField({ group: 'seo' }),
  ],
  preview: {
    select: { title: 'title', media: 'coverImage' },
    prepare({ title, media }) {
      return { title, media: media ?? DocumentTextIcon }
    },
  },
})
