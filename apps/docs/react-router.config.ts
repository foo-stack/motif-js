import type { Config } from '@react-router/dev/config';

// SSG-only — every documented route prerenders to static HTML at
// build time. No Node server in production. Routes added in Phase 3
// (Tier-1 content) are listed here in the same order as `app/routes.ts`.
export default {
  ssr: false,
  prerender: [
    '/',
    '/docs/introduction',
    '/docs/installation',
    '/docs/your-first-style',
    '/docs/web-and-native',
    '/docs/tokens',
    '/docs/variants',
    '/docs/theming',
    '/api/box',
    '/api/createTheme',
  ],
} satisfies Config;
