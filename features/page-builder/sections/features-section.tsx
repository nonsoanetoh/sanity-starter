type Feature = {
  _key?: string
  title?: string | null
  description?: string | null
  icon?: string | null
}

type FeaturesSectionProps = {
  _key: string
  documentId: string
  headline?: string | null
  subheadline?: string | null
  features?: Feature[] | null
}

export function FeaturesSection({ headline, subheadline, features }: FeaturesSectionProps) {
  return (
    <section className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        {(headline || subheadline) && (
          <div className="text-center mb-16">
            {headline && (
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">{headline}</h2>
            )}
            {subheadline && (
              <p className="text-lg text-[var(--color-muted-foreground)] max-w-2xl mx-auto">
                {subheadline}
              </p>
            )}
          </div>
        )}

        {features?.length ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <div
                key={feature._key ?? i}
                className="rounded-xl border border-[var(--color-border)] p-6"
              >
                {feature.icon && (
                  <div className="text-3xl mb-4">{feature.icon}</div>
                )}
                {feature.title && (
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                )}
                {feature.description && (
                  <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed">
                    {feature.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}
