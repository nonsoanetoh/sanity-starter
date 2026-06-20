/**
 * Client-safe Sanity env reads for Studio bundles.
 * Do NOT import ~/env here — t3-env validates server vars and
 * SANITY_STUDIO_* is not exposed to the browser.
 */
export const sanityRuntimeEnv = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-01-01',
  studioBasePath: process.env.NEXT_PUBLIC_SANITY_STUDIO_BASE_PATH ?? '/studio',
  siteUrl: process.env.NEXT_PUBLIC_URL ?? 'http://localhost:3000',
} as const
