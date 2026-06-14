import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/sanity/image'
import type { SanityImage } from '@/sanity/types'

type PostCardProps = {
  post: {
    _id: string
    title: string | null
    slug: string | null
    excerpt?: string | null
    coverImage?: SanityImage | null
    publishedAt?: string | null
    author?: { name?: string | null; picture?: SanityImage | null } | null
    categories?: Array<{ title?: string | null; slug?: string | null }> | null
  }
}

export function PostCard({ post }: PostCardProps) {
  if (!post.slug) return null

  return (
    <Link
      href={`/posts/${post.slug}`}
      className="group flex flex-col rounded-xl border border-(--color-border) overflow-hidden transition-shadow hover:shadow-md"
    >
      {post.coverImage?.asset ? (
        <div className="relative aspect-video bg-(--color-muted) overflow-hidden">
          <Image
            src={urlFor(post.coverImage).width(600).height(338).url()}
            alt={post.coverImage.alt ?? post.title ?? ''}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            placeholder={post.coverImage.asset.metadata?.lqip ? 'blur' : 'empty'}
            blurDataURL={post.coverImage.asset.metadata?.lqip ?? undefined}
          />
        </div>
      ) : (
        <div className="aspect-video bg-(--color-muted)" />
      )}

      <div className="flex flex-col flex-1 p-5">
        {post.categories?.length ? (
          <div className="flex gap-2 mb-2">
            {post.categories.slice(0, 2).map((cat) => (
              <span
                key={cat.slug}
                className="text-xs font-medium uppercase tracking-widest text-(--color-muted-foreground)"
              >
                {cat.title}
              </span>
            ))}
          </div>
        ) : null}

        <h2 className="text-lg font-semibold leading-snug mb-2 group-hover:underline">
          {post.title}
        </h2>

        {post.excerpt && (
          <p className="text-sm text-(--color-muted-foreground) line-clamp-2 mb-4 flex-1">
            {post.excerpt}
          </p>
        )}

        <div className="flex items-center gap-2 text-xs text-(--color-muted-foreground) mt-auto">
          {post.author?.name && <span>{post.author.name}</span>}
          {post.publishedAt && (
            <>
              {post.author?.name && <span>·</span>}
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </time>
            </>
          )}
        </div>
      </div>
    </Link>
  )
}
