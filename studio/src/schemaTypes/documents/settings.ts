import { defineType, defineField, defineArrayMember } from 'sanity'
import { CogIcon, LinkIcon } from '@sanity/icons'

export const settings = defineType({
  name: 'settings',
  title: 'Settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    { name: 'identity', title: 'Site', default: true },
    { name: 'navigation', title: 'Navigation' },
    { name: 'seo', title: 'SEO' },
    { name: 'security', title: 'Security' },
  ],
  fields: [
    // ── Identity ──────────────────────────────────────────────────────────────
    defineField({
      name: 'siteName',
      title: 'Site name',
      type: 'string',
      group: 'identity',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'siteDescription',
      title: 'Site description',
      type: 'text',
      group: 'identity',
      rows: 3,
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      group: 'identity',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'notFoundPage',
      title: '404 page',
      type: 'reference',
      group: 'identity',
      to: [{ type: 'page' }],
      description: 'Page shown when a URL cannot be found',
    }),

    // ── Navigation ────────────────────────────────────────────────────────────
    defineField({
      name: 'navLinks',
      title: 'Navigation links',
      type: 'array',
      group: 'navigation',
      of: [
        defineArrayMember({
          type: 'object',
          icon: LinkIcon,
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'link',
              title: 'Destination',
              type: 'link',
              validation: (r) => r.required(),
            }),
          ],
          preview: {
            select: {
              title: 'label',
              linkType: 'link.linkType',
              internalSlug: 'link.internalPage->slug.current',
              externalUrl: 'link.externalUrl',
            },
            prepare({ title, linkType, internalSlug, externalUrl }) {
              const href =
                linkType === 'internal'
                  ? internalSlug ? `/${internalSlug}` : '(no page)'
                  : (externalUrl ?? '(no URL)')
              return { title, subtitle: href, media: LinkIcon }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'footer',
      title: 'Footer tagline',
      type: 'string',
      group: 'navigation',
      description: 'Short line of text shown in the footer',
    }),

    // ── SEO ───────────────────────────────────────────────────────────────────
    defineField({
      name: 'seo',
      title: 'Default SEO',
      type: 'seo',
      group: 'seo',
      description: 'Fallback values used when individual pages do not set their own SEO fields',
    }),
    defineField({
      name: 'favicon',
      title: 'Favicon',
      type: 'image',
      group: 'seo',
    }),

    // ── Security ──────────────────────────────────────────────────────────────
    defineField({
      name: 'siteProtection',
      title: 'Enable site-wide password gate',
      type: 'boolean',
      group: 'security',
      initialValue: false,
      description:
        'Locks the entire site behind a password prompt. Credentials are set via environment variables (SITE_PROTECTION_ENABLED / SITE_PASSWORD). This toggle documents the intent in the CMS.',
    }),
  ],
  preview: {
    select: { title: 'siteName' },
    prepare({ title }) {
      return { title: title ?? 'Settings', media: CogIcon }
    },
  },
})
