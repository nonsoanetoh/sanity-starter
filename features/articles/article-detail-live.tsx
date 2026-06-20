'use client'

import { usePresentationQuery } from 'next-sanity/hooks'
import { ARTICLE_QUERY } from '~/features/sanity/queries'
import type { ArticleDocument } from '~/features/sanity/types'
import { ArticleDetailView } from './article-detail-view'

type Props = {
  slug: string
  initialArticle: ArticleDocument
}

export function ArticleDetailLive({ slug, initialArticle }: Props) {
  const { data } = usePresentationQuery({
    query: ARTICLE_QUERY,
    params: { slug },
  })

  const article = (data ?? initialArticle) as ArticleDocument

  return <ArticleDetailView article={article} />
}
