import { defineType, defineField } from 'sanity'
import { EnvelopeIcon } from '@sanity/icons'

export const contactFormSubmission = defineType({
  name: 'contactFormSubmission',
  title: 'Contact Form Submission',
  type: 'document',
  icon: EnvelopeIcon,
  readOnly: true,
  fields: [
    defineField({ name: 'name', type: 'string' }),
    defineField({ name: 'email', type: 'string' }),
    defineField({ name: 'message', type: 'text' }),
    defineField({ name: 'submittedAt', type: 'datetime' }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'email' },
  },
})
