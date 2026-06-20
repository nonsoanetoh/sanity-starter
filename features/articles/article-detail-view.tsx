'use client'

import Image from 'next/image'
import { stegaClean } from '@sanity/client/stega'
import { PortableText } from '~/features/rich-text'
import type { ArticleDocument } from '~/features/sanity/types'

export function ArticleDetailView({ article }: { article: ArticleDocument }) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-balance">{article.title}</h1>
        {article.excerpt && (
          <p className="mt-4 text-lg text-(--color-muted-foreground)">{article.excerpt}</p>
        )}
      </header>

      {article.coverImage?.asset?.url && (
        <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-xl">
          <Image
            src={article.coverImage.asset.url}
            alt={stegaClean(article.coverImage.alt) ?? ''}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        </div>
      )}

      {Array.isArray(article.body) && <PortableText value={article.body} />}
    </article>
  )
}
