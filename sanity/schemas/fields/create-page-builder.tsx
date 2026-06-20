import { defineField, defineArrayMember } from 'sanity'
import { sections } from '../page-sections'

type PageBuilderOptions = {
  group?: string
  whitelist?: string[]
  sectionMaxCount?: number
}

export function createPageBuilderField({
  group,
  whitelist,
  sectionMaxCount,
}: PageBuilderOptions = {}) {
  const allowedSections = whitelist
    ? sections.filter((s) => whitelist.includes(s.name ?? ''))
    : sections

  return defineField({
    name: 'pageBuilder',
    title: 'Page Builder',
    type: 'object',
    group,
    fields: [
      defineField({
        name: 'sectionsArray',
        title: 'Sections',
        type: 'array',
        of: allowedSections.map((section) => defineArrayMember({ type: section.name! })),
        validation: (rule) =>
          sectionMaxCount ? rule.max(sectionMaxCount) : rule,
      }),
    ],
  })
}
