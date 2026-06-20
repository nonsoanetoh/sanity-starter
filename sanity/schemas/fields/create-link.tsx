import { defineField } from 'sanity'

type LinkFieldOptions = {
  group?: string
  name?: string
}

export function createLinkField({ group, name = 'link' }: LinkFieldOptions = {}) {
  return defineField({
    name,
    title: 'Link',
    type: 'link',
    group,
  })
}
