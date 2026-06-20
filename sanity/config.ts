import { sanityRuntimeEnv } from './runtime-env'

export const sanityConfig = {
  projectId: sanityRuntimeEnv.projectId,
  dataset: sanityRuntimeEnv.dataset,
  apiVersion: sanityRuntimeEnv.apiVersion,
  studioBasePath: sanityRuntimeEnv.studioBasePath,
  siteUrl: sanityRuntimeEnv.siteUrl,
} as const
