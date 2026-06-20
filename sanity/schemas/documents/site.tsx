import { defineType, defineField, defineArrayMember } from 'sanity'
import { CogIcon, LinkIcon } from '@sanity/icons'
import { createSeoMetadataField } from '../fields/seo-metadata'
import { createLinkField } from '../fields/create-link'

export const site = defineType({
  name: 'site',
  title: 'Site',
  type: 'document',
  icon: CogIcon,
  groups: [
    { name: 'identity', title: 'Site', default: true },
    { name: 'navigation', title: 'Navigation' },
    { name: 'seo', title: 'SEO' },
    { name: 'security', title: 'Security' },
    { name: 'forms', title: 'Forms' },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Site name',
      type: 'string',
      group: 'identity',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'description',
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
      fields: [defineField({ name: 'alt', type: 'string' })],
    }),
    defineField({
      name: 'favicon',
      title: 'Favicon',
      type: 'image',
      group: 'identity',
    }),
    defineField({
      name: 'notFoundPage',
      title: '404 page',
      type: 'reference',
      group: 'identity',
      to: [{ type: 'page' }],
    }),
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
            defineField({ name: 'label', type: 'string', validation: (r) => r.required() }),
            createLinkField({ name: 'link' }),
          ],
          preview: {
            select: { title: 'label' },
          },
        }),
      ],
    }),
    defineField({
      name: 'footer',
      title: 'Footer tagline',
      type: 'string',
      group: 'navigation',
    }),
    defineField({
      name: 'redirects',
      title: 'Redirects',
      type: 'array',
      group: 'navigation',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'source', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'destination', type: 'string', validation: (r) => r.required() }),
            defineField({
              name: 'permanent',
              type: 'boolean',
              initialValue: true,
            }),
          ],
        }),
      ],
    }),
    createSeoMetadataField({ group: 'seo' }),
    defineField({
      name: 'basicAuthEnabled',
      title: 'Enable site-wide Basic Auth',
      type: 'boolean',
      group: 'security',
      initialValue: false,
      description: 'Credentials are set via BASIC_AUTH_USERNAME and BASIC_AUTH_PASSWORD env vars.',
    }),
    defineField({
      name: 'formNotificationEmails',
      title: 'Form notification emails',
      type: 'array',
      group: 'forms',
      of: [{ type: 'string' }],
      description: 'Receives an email when a contact form is submitted (requires Resend env vars).',
    }),
  ],
  preview: {
    select: { title: 'name' },
    prepare({ title }) {
      return { title: title ?? 'Site', media: CogIcon }
    },
  },
})
