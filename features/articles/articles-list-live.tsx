'use client'

import { usePresentationQuery } from 'next-sanity/hooks'
import { ARTICLES_QUERY } from '~/features/sanity/queries'
import type { ArticleDocument } from '~/features/sanity/types'
import { ArticlesListView } from './articles-list-view'

type Props = {
  initialArticles: ArticleDocument[]
}

export function ArticlesListLive({ initialArticles }: Props) {
  const { data } = usePresentationQuery({
    query: ARTICLES_QUERY,
  })

  const articles = (data ?? initialArticles) as ArticleDocument[]

  return <ArticlesListView articles={articles} />
}
