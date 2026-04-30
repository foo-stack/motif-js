import type { Config } from '@react-router/dev/config';

// SSG-only — every documented route prerenders to static HTML at
// build time. No Node server in production. Phase 0 lists just the
// scaffold routes; the list grows as Tier-1 pages land in Phase 3.
export default {
  ssr: false,
  prerender: ['/', '/docs/introduction'],
} satisfies Config;
