import { createClient } from '@sanity/client'
import { env } from '~/env'

export function getSanityWriteClient() {
  const token = env.SANITY_API_EDIT_TOKEN
  if (!token) {
    throw new Error('SANITY_API_EDIT_TOKEN is required to write form submissions')
  }

  return createClient({
    projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION,
    token,
    useCdn: false,
  })
}
