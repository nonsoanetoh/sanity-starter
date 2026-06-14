type Step = {
  _key?: string
  title?: string | null
  description?: string | null
  code?: string | null
}

type StepsSectionProps = {
  _key: string
  documentId: string
  eyebrow?: string | null
  headline?: string | null
  subheadline?: string | null
  steps?: Step[] | null
}

export function StepsSection({ eyebrow, headline, subheadline, steps }: StepsSectionProps) {
  if (!steps?.length) return null

  return (
    <section className="py-24 px-4 border-t border-(--color-border)">
      <div className="max-w-3xl mx-auto">
        {(eyebrow || headline || subheadline) && (
          <div className="mb-12">
            {eyebrow && (
              <p className="text-sm font-semibold uppercase tracking-widest text-(--color-muted-foreground) mb-3">
                {eyebrow}
              </p>
            )}
            {headline && (
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">{headline}</h2>
            )}
            {subheadline && (
              <p className="text-lg text-(--color-muted-foreground) leading-relaxed">{subheadline}</p>
            )}
          </div>
        )}

        <ol className="flex flex-col gap-8">
          {steps.map((step, i) => (
            <li key={step._key ?? i} className="flex gap-5">
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-(--color-border) bg-(--color-muted) text-sm font-semibold tabular-nums"
                aria-hidden
              >
                {i + 1}
              </span>
              <div className="min-w-0 flex-1 pt-0.5">
                {step.title && <h3 className="text-base font-semibold mb-1">{step.title}</h3>}
                {step.description && (
                  <p className="text-sm text-(--color-muted-foreground) leading-relaxed mb-3">
                    {step.description}
                  </p>
                )}
                {step.code && (
                  <pre className="overflow-x-auto rounded-lg border border-(--color-border) bg-(--color-code-background) px-4 py-3 text-sm font-mono leading-relaxed text-(--color-code-foreground)">
                    <code className="text-inherit">{step.code}</code>
                  </pre>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
