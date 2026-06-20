import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    SANITY_API_VIEW_TOKEN: z.string().min(1).optional(),
    SANITY_API_EDIT_TOKEN: z.string().min(1).optional(),
    SANITY_REVALIDATE_SECRET: z.string().min(1).optional(),
    RESEND_API_KEY: z.string().min(1).optional(),
    RESEND_EMAIL_FROM: z.string().email().optional(),
    BASIC_AUTH_USERNAME: z.string().min(1).optional(),
    BASIC_AUTH_PASSWORD: z.string().min(1).optional(),
  },
  client: {
    NEXT_PUBLIC_URL: z.string().url().default('http://localhost:3000'),
    NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().min(1),
    NEXT_PUBLIC_SANITY_DATASET: z.string().min(1).default('production'),
    NEXT_PUBLIC_SANITY_API_VERSION: z.string().min(1).default('2024-01-01'),
    NEXT_PUBLIC_SANITY_STUDIO_BASE_PATH: z.string().min(1).default('/studio'),
    NEXT_PUBLIC_UMAMI_WEBSITE_ID: z.string().min(1).optional(),
    NEXT_PUBLIC_UMAMI_HOST: z.string().url().default('https://cloud.umami.is'),
  },
  runtimeEnv: {
    SANITY_API_VIEW_TOKEN:
      process.env.SANITY_API_VIEW_TOKEN ?? process.env.SANITY_API_READ_TOKEN,
    SANITY_API_EDIT_TOKEN: process.env.SANITY_API_EDIT_TOKEN,
    SANITY_REVALIDATE_SECRET: process.env.SANITY_REVALIDATE_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_EMAIL_FROM: process.env.RESEND_EMAIL_FROM,
    BASIC_AUTH_USERNAME: process.env.BASIC_AUTH_USERNAME,
    BASIC_AUTH_PASSWORD: process.env.BASIC_AUTH_PASSWORD,
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
    NEXT_PUBLIC_SANITY_PROJECT_ID:
      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ??
      process.env.SANITY_STUDIO_PROJECT_ID,
    NEXT_PUBLIC_SANITY_DATASET:
      process.env.NEXT_PUBLIC_SANITY_DATASET ?? process.env.SANITY_STUDIO_DATASET,
    NEXT_PUBLIC_SANITY_API_VERSION: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
    NEXT_PUBLIC_SANITY_STUDIO_BASE_PATH: process.env.NEXT_PUBLIC_SANITY_STUDIO_BASE_PATH,
    NEXT_PUBLIC_UMAMI_WEBSITE_ID: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
    NEXT_PUBLIC_UMAMI_HOST: process.env.NEXT_PUBLIC_UMAMI_HOST,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
})
