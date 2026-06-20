/// <reference types="node" />
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { presentationTool } from 'sanity/presentation'
import { media } from 'sanity-plugin-media'
import { muxInput } from 'sanity-plugin-mux-input'
import { schemaTypes } from './sanity/schemas'
import { buildStructure } from './sanity/structure'
import { locations, mainDocuments } from './sanity/presentation/resolve'
import { sanityRuntimeEnv } from './sanity/runtime-env'

export default defineConfig({
  name: 'default',
  title: 'The Content Architecture',
  projectId: sanityRuntimeEnv.projectId,
  dataset: sanityRuntimeEnv.dataset,
  basePath: sanityRuntimeEnv.studioBasePath,
  plugins: [
    structureTool({ structure: buildStructure }),
    presentationTool({
      previewUrl: {
        origin: sanityRuntimeEnv.siteUrl,
        draftMode: {
          enable: `${sanityRuntimeEnv.siteUrl}/api/draft-mode/enable`,
          disable: `${sanityRuntimeEnv.siteUrl}/api/draft-mode/disable`,
        },
      },
      resolve: {
        mainDocuments,
        locations,
      },
    }),
    media(),
    muxInput(),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
})
