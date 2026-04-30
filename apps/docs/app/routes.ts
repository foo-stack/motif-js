import { type RouteConfig, index, route } from '@react-router/dev/routes';

// Phase 0: just the scaffold proof point. Tier-1 routes (home, the
// remaining /docs/* pages, /api/*, /404) come in later phases per
// DOC_PLAN.md.
export default [
  index('routes/_index.tsx'),
  route('docs/introduction', 'routes/docs.introduction.tsx'),
] satisfies RouteConfig;
