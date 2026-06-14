import { defineType, defineField, defineArrayMember } from 'sanity'
import { DocumentTextIcon } from '@sanity/icons'

export const post = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    { name: 'identity', title: 'Post', default: true },
    { name: 'content', title: 'Content' },
    { name: 'meta', title: 'Meta' },
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
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      group: 'identity',
      initialValue: () => new Date().toISOString(),
    }),

    // ── Content ───────────────────────────────────────────────────────────────
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      group: 'content',
      rows: 3,
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent',
      group: 'content',
    }),

    // ── Meta ─────────────────────────────────────────────────────────────────
    defineField({
      name: 'authors',
      title: 'Authors',
      type: 'array',
      group: 'meta',
      // Array makes it easy to add co-authors later without a migration.
      // Limit to 1 for now via validation.
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'author' }] })],
      validation: (rule) => rule.max(3),
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      group: 'meta',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'category' }] })],
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
      author: 'authors.0.name',
      media: 'coverImage',
    },
    prepare({ title, author, media }) {
      return {
        title,
        subtitle: author ? `by ${author}` : '',
        media: media ?? DocumentTextIcon,
      }
    },
  },
})
