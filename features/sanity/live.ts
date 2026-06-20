import { defineLive } from 'next-sanity/live'
import { env } from '~/env'
import { sanityClient } from './client'

const token = env.SANITY_API_VIEW_TOKEN

export const { sanityFetch: liveSanityFetch } = defineLive({
  client: sanityClient,
  serverToken: token ?? false,
  browserToken: token ?? false,
  fetchOptions: {
    revalidate: process.env.NODE_ENV === 'development' ? false : 60,
  },
})

/** Props for root layout — tuned for Presentation / draft preview. */
export const sanityLiveProps = {
  refreshOnFocus: false,
  refreshOnReconnect: false,
  intervalOnGoAway: false,
} as const
