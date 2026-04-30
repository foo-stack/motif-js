import { type RouteConfig, index, route } from '@react-router/dev/routes';

// Tier-1 surface (DOC_PLAN.md Phase 3). Every path that resolves to
// a real page must also be listed in `react-router.config.ts`'s
// `prerender` array — that's what causes RR7's framework mode to bake
// each route to static HTML at build time.
export default [
  index('routes/_index.tsx'),

  // Concepts
  route('docs/introduction', 'routes/docs.introduction.tsx'),
  route('docs/installation', 'routes/docs.installation.tsx'),
  route('docs/your-first-style', 'routes/docs.your-first-style.tsx'),
  route('docs/web-and-native', 'routes/docs.web-and-native.tsx'),
  route('docs/tokens', 'routes/docs.tokens.tsx'),
  route('docs/variants', 'routes/docs.variants.tsx'),
  route('docs/theming', 'routes/docs.theming.tsx'),

  // API reference
  route('api/box', 'routes/api.box.tsx'),
  route('api/createTheme', 'routes/api.createTheme.tsx'),

  // Catch-all
  route('*', 'routes/$.tsx'),
] satisfies RouteConfig;
