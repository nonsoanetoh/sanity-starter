/// <reference types="node" />

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";
import { media } from "sanity-plugin-media";
import { muxInput } from "sanity-plugin-mux-input";
import { locations, mainDocuments } from "./sanity/presentation/resolve";
import { sanityRuntimeEnv } from "./sanity/runtime-env";
import { schemaTypes } from "./sanity/schemas";
import { buildStructure } from "./sanity/structure";

export default defineConfig({
  name: "default",
  title: "Actta Studio",
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
});
