import { defineType, defineField, defineArrayMember } from 'sanity'
import { DocumentIcon } from '@sanity/icons'

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    { name: 'identity', title: 'Page', default: true },
    { name: 'content', title: 'Content' },
    { name: 'seo', title: 'SEO' },
    { name: 'security', title: 'Security' },
  ],
  fields: [
    // ── Identity ──────────────────────────────────────────────────────────────
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'identity',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'identity',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),

    // ── Content ───────────────────────────────────────────────────────────────
    defineField({
      name: 'pageBuilder',
      title: 'Page Builder',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({ type: 'heroSection' }),
        defineArrayMember({ type: 'featuresSection' }),
        defineArrayMember({ type: 'stepsSection' }),
        defineArrayMember({ type: 'ctaSection' }),
      ],
    }),

    // ── SEO ───────────────────────────────────────────────────────────────────
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),

    // ── Security ──────────────────────────────────────────────────────────────
    defineField({
      name: 'protection',
      title: 'Password Protection',
      type: 'protection',
      group: 'security',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current',
    },
    prepare({ title, slug }) {
      return {
        title,
        subtitle: slug ? `/${slug}` : '',
        media: DocumentIcon,
      }
    },
  },
})
