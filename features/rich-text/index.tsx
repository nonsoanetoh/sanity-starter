import {
  PortableText as BasePortableText,
  type PortableTextComponents,
} from '@portabletext/react'
type PortableTextBlock = Record<string, unknown>
import Image from 'next/image'
import { urlFor } from '~/features/sanity/image'

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null
      const aspectRatio = value.asset?.metadata?.dimensions?.aspectRatio ?? 1.6
      const lqip = value.asset?.metadata?.lqip
      return (
        <figure className="my-8">
          <div className="relative overflow-hidden rounded-xl bg-(--color-muted)">
            <Image
              src={urlFor(value).width(1200).url()}
              alt={value.alt ?? ''}
              width={1200}
              height={Math.round(1200 / aspectRatio)}
              className="w-full"
              placeholder={lqip ? 'blur' : 'empty'}
              blurDataURL={lqip ?? undefined}
            />
          </div>
          {value.caption && (
            <figcaption className="mt-2 text-center text-sm text-(--color-muted-foreground)">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
  },
  marks: {
    code: ({ children }) => (
      <code className="rounded bg-(--color-code-background) px-1.5 py-0.5 text-sm font-mono text-(--color-code-foreground)">
        {children}
      </code>
    ),
    link: ({ children, value }) => {
      const rel = value?.blank ? 'noreferrer noopener' : undefined
      const target = value?.blank ? '_blank' : undefined
      return (
        <a href={value?.href} rel={rel} target={target} className="underline underline-offset-2">
          {children}
        </a>
      )
    },
  },
  block: {
    h2: ({ children }) => (
      <h2 className="text-2xl font-bold tracking-tight mt-10 mb-4">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-semibold tracking-tight mt-8 mb-3">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-lg font-semibold mt-6 mb-2">{children}</h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-(--color-border) pl-4 italic text-(--color-muted-foreground) my-6">
        {children}
      </blockquote>
    ),
    code: ({ children }) => (
      <pre className="not-prose overflow-x-auto rounded-lg border border-(--color-border) bg-(--color-code-background) px-4 py-3 text-sm font-mono leading-relaxed my-6 whitespace-pre-wrap text-(--color-code-foreground)">
        <code className="text-inherit">{children}</code>
      </pre>
    ),
    normal: ({ children }) => <p className="leading-7 mb-4">{children}</p>,
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc list-outside ml-6 mb-4 space-y-1">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal list-outside ml-6 mb-4 space-y-1">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-7">{children}</li>,
    number: ({ children }) => <li className="leading-7">{children}</li>,
  },
}

export function PortableText({ value }: { value: PortableTextBlock[] }) {
  return <BasePortableText value={value as never} components={components} />
}
