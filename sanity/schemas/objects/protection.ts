import { defineField, defineType } from 'sanity'
import { LockIcon } from '@sanity/icons'

export const protection = defineType({
  name: 'protection',
  title: 'Password Protection',
  type: 'object',
  icon: LockIcon,
  fields: [
    defineField({
      name: 'enabled',
      title: 'Enable password protection',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'password',
      title: 'Password',
      type: 'string',
      hidden: ({ parent }) => !parent?.enabled,
      description: 'Visitors must enter this password to view this content',
      validation: (rule) =>
        rule.custom((value, { parent }) => {
          const p = parent as { enabled?: boolean } | undefined
          if (p?.enabled && !value) return 'A password is required when protection is enabled'
          return true
        }),
    }),
  ],
  preview: {
    select: { enabled: 'enabled' },
    prepare({ enabled }) {
      return {
        title: 'Password Protection',
        subtitle: enabled ? 'Enabled' : 'Disabled',
        media: LockIcon,
      }
    },
  },
})
