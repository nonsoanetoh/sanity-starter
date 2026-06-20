import { sanityClient } from '~/features/sanity/client'
import { defineEnableDraftMode } from 'next-sanity/draft-mode'
import { env } from '~/env'

export const { GET } = defineEnableDraftMode({
  client: sanityClient.withConfig({
    token: env.SANITY_API_VIEW_TOKEN,
  }),
})
