import createImageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import type { SanityImage } from './types'
import { sanityClient } from './client'

const imageBuilder = createImageUrlBuilder(sanityClient)

export function urlFor(source: SanityImageSource) {
  return imageBuilder.image(source)
}

export function getOgImageSrc(image: SanityImage) {
  if (!image?.asset?.url) return undefined
  return urlFor(image).width(1200).height(630).fit('crop').url()
}
