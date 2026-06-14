import { defineField, defineType } from 'sanity'
import { LinkIcon } from '@sanity/icons'

/**
 * Reusable link primitive — handles internal (page/post reference) and
 * external (URL) destinations in a single field.
 *
 * The `blank` field controls target="_blank". `label` is intentionally
 * omitted here — it lives on the parent (callToAction, navLink, etc.)
 * so that each usage context names the link on its own terms.
 *
 * Usage:  defineField({ name: 'link', type: 'link' })
 */
export const link = defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'linkType',
      title: 'Link type',
      type: 'string',
      options: {
        list: [
          { title: 'Internal page', value: 'internal' },
          { title: 'External URL', value: 'external' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'external',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'internalPage',
      title: 'Page',
      type: 'reference',
      to: [{ type: 'page' }, { type: 'post' }, { type: 'homePage' }],
      hidden: ({ parent }) => parent?.linkType !== 'internal',
      validation: (r) =>
        r.custom((value, { parent }) => {
          const p = parent as { linkType?: string } | undefined
          if (p?.linkType === 'internal' && !value) return 'Select a page'
          return true
        }),
    }),
    defineField({
      name: 'externalUrl',
      title: 'URL',
      type: 'url',
      hidden: ({ parent }) => parent?.linkType !== 'external',
      validation: (r) =>
        r.custom((value, { parent }) => {
          const p = parent as { linkType?: string } | undefined
          if (p?.linkType === 'external' && !value) return 'Enter a URL'
          return true
        }).uri({ allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel'] }),
    }),
    defineField({
      name: 'blank',
      title: 'Open in new tab',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      linkType: 'linkType',
      internalSlug: 'internalPage->slug.current',
      externalUrl: 'externalUrl',
    },
    prepare({ linkType, internalSlug, externalUrl }) {
      const href =
        linkType === 'internal' ? (internalSlug ? `/${internalSlug}` : '(no page selected)') : (externalUrl ?? '(no URL)')
      return { title: href, media: LinkIcon }
    },
  },
})
