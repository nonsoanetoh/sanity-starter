import { sanityFetch } from '@/sanity/live'
import { POSTS_QUERY } from '@/sanity/queries'
import { PostCard } from '@/components/posts/PostCard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Read the latest posts',
}

export default async function PostsPage() {
  const { data: posts } = await sanityFetch({ query: POSTS_QUERY })

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold tracking-tight mb-2 [text-wrap:balance]">Blog</h1>
      <p className="text-[var(--color-muted-foreground)] mb-12">
        {posts?.length ?? 0} {posts?.length === 1 ? 'post' : 'posts'}
      </p>
      {!posts?.length ? (
        <p className="text-[var(--color-muted-foreground)]">No posts yet. Create one in Sanity Studio.</p>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
