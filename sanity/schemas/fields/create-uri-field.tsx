import { defineField } from 'sanity'
import { kebabCase } from 'change-case'
import { sanityRuntimeEnv } from '../../runtime-env'

type UriFieldOptions = {
  group?: string
  source?: string
  name?: string
  readOnly?: (ctx: { document?: { _id?: string } }) => boolean
}

export function createUriField({
  group,
  source = 'title',
  name = 'uri',
  readOnly,
}: UriFieldOptions) {
  const studioPath = sanityRuntimeEnv.studioBasePath

  return defineField({
    name,
    title: 'URI',
    type: 'slug',
    group,
    readOnly,
    options: {
      source,
      slugify: (input: string) => {
        const slug = `/${kebabCase(input)}`
        return slug === '/' ? '/' : slug.replace(/\/+/g, '/')
      },
    },
    validation: (rule) =>
      rule.required().custom((value) => {
        const current = typeof value === 'object' && value && 'current' in value
          ? (value as { current?: string }).current
          : undefined
        if (current === studioPath || current?.startsWith(`${studioPath}/`)) {
          return `URI cannot use the reserved Studio path (${studioPath})`
        }
        return true
      }),
  })
}
