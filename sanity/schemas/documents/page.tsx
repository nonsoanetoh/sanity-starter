import { defineField, defineType } from 'sanity'
import { DocumentIcon } from '@sanity/icons'
import { createPageBuilderField } from '../fields/create-page-builder'
import { createUriField } from '../fields/create-uri-field'
import { createSeoMetadataField } from '../fields/seo-metadata'
import { isHomepageDocument } from '../../constants'

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    { name: 'page', title: 'Page', default: true },
    { name: 'content', title: 'Content' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({ name: 'title', type: 'string', group: 'page', validation: (r) => r.required() }),
    createUriField({ group: 'page', source: 'title', readOnly: isHomepageDocument }),
    defineField({
      name: 'passwordProtected',
      type: 'boolean',
      group: 'page',
      title: 'Password protect',
      initialValue: false,
    }),
    createPageBuilderField({ group: 'content' }),
    createSeoMetadataField({ group: 'seo' }),
  ],
  preview: {
    select: { title: 'title', uri: 'uri.current' },
    prepare({ title, uri }) {
      return { title, subtitle: uri ?? '', media: DocumentIcon }
    },
  },
})
