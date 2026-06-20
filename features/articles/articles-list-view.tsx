'use client'

import Link from 'next/link'
import type { ArticleDocument } from '~/features/sanity/types'

export function ArticlesListView({ articles }: { articles: ArticleDocument[] }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-10 text-4xl font-bold tracking-tight">Articles</h1>
      <ul className="space-y-8">
        {articles.map((article) => (
          <li key={article._id}>
            <Link href={`/articles/${article.slug}`} className="group block">
              <h2 className="text-xl font-semibold group-hover:underline">{article.title}</h2>
              {article.excerpt && (
                <p className="mt-2 text-(--color-muted-foreground)">{article.excerpt}</p>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
