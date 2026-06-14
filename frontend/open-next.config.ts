import type { OpenNextConfig } from '@opennextjs/cloudflare'

const config: OpenNextConfig = {
  default: {
    override: {
      wrapper: 'cloudflare-node',
      converter: 'edge',
      incrementalCache: async () => import('@opennextjs/cloudflare').then((m) => m.r2IncrementalCache),
      queue: 'direct',
    },
  },
  middleware: {
    external: true,
    override: {
      wrapper: 'cloudflare-edge',
      converter: 'edge',
      proxyExternalRequest: 'fetch',
    },
  },
}

export default config
