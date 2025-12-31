import { defineConfig } from 'figue'
import { z } from 'zod'

export const config = defineConfig(
  {
    app: {
      version: {
        doc: 'Application current version',
        schema: z.string(),
        default: '0.0.0',
        env: 'PACKAGE_VERSION',
      },
      baseUrl: {
        doc: 'Application base url',
        schema: z.string(),
        default: '/',
        env: 'BASE_URL',
      },
    },
    vercelAnalytics: {
      enabled: {
        doc: 'Enable Vercel analytics',
        schema: z.coerce.boolean(),
        default: false,
        env: 'VITE_ENABLE_VERCEL_ANALYTICS',
      },
      debug: {
        doc: 'Enable debug logging for Vercel analytics',
        schema: z.coerce.boolean(),
        default: false,
        env: 'VITE_DEBUG_VERCEL_ANALYTICS',
      },
    },
    googleAnalytics: {
      id: {
        doc: 'Google analytics Measurement ID (G-XXXXXXXXXX). Presence enables GA.',
        schema: z.string(),
        default: '',
        env: 'VITE_GOOGLE_ANALYTICS_ID',
      },
    },
    umamiAnalytics: {
      websiteId: {
        doc: 'Umami website ID. Presence enables Umami analytics.',
        schema: z.string(),
        default: '',
        env: 'VITE_UMAMI_WEBSITE_ID',
      },
      scriptUrl: {
        doc: 'Umami script URL.',
        schema: z.string(),
        default: 'https://analytics.umami.is/script.js',
        env: 'VITE_UMAMI_SCRIPT_URL',
      },
    },
    consent: {
      enabled: {
        doc: 'Enable cookie consent management system',
        schema: z.coerce.boolean(),
        default: false,
        env: 'VITE_CONSENT_ENABLE',
      },
      strict: {
        doc: 'Enable strict consent mode - requires user consent regardless of region',
        schema: z.coerce.boolean(),
        default: false,
        env: 'VITE_CONSENT_STRICT',
      },
    },
  },
  {
    envSource: {
      ...import.meta.env,
      // import.meta.env.PACKAGE_VERSION is statically replaced at build time (see vite.config.ts define)
      PACKAGE_VERSION: import.meta.env.PACKAGE_VERSION,
    },
  },
).config
