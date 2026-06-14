/// <reference types="node" />
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { presentationTool } from "sanity/presentation";
import { unsplashImageAsset } from "sanity-plugin-asset-source-unsplash";
import { media } from "sanity-plugin-media";
import { muxInput } from "sanity-plugin-mux-input";
import { schemaTypes } from "./src/schemaTypes";
import { structure } from "./src/structure";
import { locate } from "./src/presentation/locate";

const projectId = (process.env.SANITY_STUDIO_PROJECT_ID ??
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID)!;
const dataset =
  process.env.SANITY_STUDIO_DATASET ??
  process.env.NEXT_PUBLIC_SANITY_DATASET ??
  "production";
const previewUrl =
  process.env.SANITY_STUDIO_PREVIEW_URL ?? "http://localhost:3000";

export default defineConfig({
  name: "default",
  title: "Nonso's Sanity Starter",
  projectId,
  dataset,
  plugins: [
    structureTool({ structure }),
    presentationTool({
      locate,
      previewUrl: {
        origin: previewUrl,
        draftMode: {
          enable: `${previewUrl}/api/draft-mode/enable`,
        },
      },
    }),
    // Media library — browse, tag, and manage all uploaded assets
    media(),
    // Mux — video upload and streaming (see sanity.md for why video lives here, not in the CMS)
    muxInput(),
    // Unsplash — search and insert stock photos directly from the image picker
    unsplashImageAsset(),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
});
