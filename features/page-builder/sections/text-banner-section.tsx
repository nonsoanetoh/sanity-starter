type TextBannerSectionProps = {
  _key: string
  documentId: string
  headline?: string | null
  subheadline?: string | null
}

export function TextBannerSection({ headline, subheadline }: TextBannerSectionProps) {
  return (
    <section className="py-24 px-4">
      <div className="max-w-3xl mx-auto text-center">
        {headline && (
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">{headline}</h2>
        )}
        {subheadline && (
          <p className="text-(--color-muted-foreground) leading-relaxed">{subheadline}</p>
        )}
      </div>
    </section>
  )
}
