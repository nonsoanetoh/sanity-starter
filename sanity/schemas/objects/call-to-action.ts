import { defineType, defineField } from 'sanity'
import { LaunchIcon } from '@sanity/icons'

export const callToAction = defineType({
  name: 'callToAction',
  title: 'Call to Action',
  type: 'object',
  icon: LaunchIcon,
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'link',
      title: 'Destination',
      type: 'link',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: {
        list: [
          { title: 'Primary', value: 'primary' },
          { title: 'Secondary', value: 'secondary' },
          { title: 'Ghost', value: 'ghost' },
        ],
        layout: 'radio',
      },
      initialValue: 'primary',
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
      return { title, subtitle: href, media: LaunchIcon }
    },
  },
})
