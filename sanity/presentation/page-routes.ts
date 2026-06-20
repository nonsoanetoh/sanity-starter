import type { DocumentResolverContext } from 'sanity/presentation'

/** First path segments that must not resolve to CMS pages. */
const RESERVED_SEGMENTS = new Set(['articles', 'studio', 'api', 'sanity-studio'])

const SEGMENT_NAMES = ['a', 'b', 'c', 'd', 'e'] as const

type PageRouteResolve = {
  filter: string
  params: { uri: string }
}

function resolvePageUri(segments: string[]): PageRouteResolve | undefined {
  if (segments.length === 0) return undefined
  if (RESERVED_SEGMENTS.has(segments[0]!)) return undefined

  const uri = `/${segments.join('/')}`.replace(/\/+/g, '/')
  return {
    filter: `_type == "page" && uri.current == $uri`,
    params: { uri },
  }
}

function resolveFromNamedParams(
  ctx: DocumentResolverContext,
  names: readonly string[],
): PageRouteResolve | undefined {
  const segments = names
    .map((name) => ctx.params?.[name])
    .filter((value): value is string => typeof value === 'string')

  if (segments.length !== names.length) return undefined
  return resolvePageUri(segments)
}

/**
 * Explicit nested routes (`/:a/:b/...`) — deepest first so the first match wins.
 * Supports URIs up to 5 segments (e.g. `/marketing/campaigns/2026/q1`).
 */
export function buildNestedPageRoutes(maxDepth = 5) {
  const routes = []

  for (let depth = maxDepth; depth >= 1; depth--) {
    const names = SEGMENT_NAMES.slice(0, depth)
    routes.push({
      route: `/${names.map((name) => `:${name}`).join('/')}`,
      resolve: (ctx: DocumentResolverContext) => resolveFromNamedParams(ctx, names),
    })
  }

  return routes
}
