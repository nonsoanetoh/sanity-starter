import type { Rule, ValidationContext } from 'sanity'

type ParentWithField = Record<string, unknown> | undefined

export function visibleIf(field: string, value: unknown) {
  return {
    hidden: ({ parent }: { parent?: ParentWithField }) => parent?.[field] !== value,
  }
}

export function requiredIf(field: string, value: unknown) {
  return {
    validation: (rule: Rule) =>
      rule.custom((fieldValue, context: ValidationContext) => {
        const parent = context.parent as ParentWithField
        if (parent?.[field] === value && !fieldValue) {
          return 'Required'
        }
        return true
      }),
  }
}

export function composeValidation(...validators: Array<(rule: Rule) => Rule>) {
  return (rule: Rule) => validators.reduce((r, fn) => fn(r), rule)
}
