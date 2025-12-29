import { defineConfig } from 'figue'
import * as v from 'valibot'

export const config = defineConfig(
  {
    app: {
      version: {
        doc: 'Application current version',
        schema: v.string(),
        default: '0.0.0',
        env: 'PACKAGE_VERSION',
      },
      baseUrl: {
        doc: 'Application base url',
        schema: v.string(),
        default: '/',
        env: 'BASE_URL',
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
