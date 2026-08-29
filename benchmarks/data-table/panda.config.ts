import { defineConfig } from '@pandacss/dev';

/**
 * Minimal Panda config for the benchmark row. No presets and no JSX runtime:
 * the bench only needs `css()`, and pulling in Panda's default preset would
 * generate a large token surface this suite never touches.
 */
export default defineConfig({
  preflight: false,
  include: ['./src/**/*.bench.tsx'],
  outdir: 'styled-system',
  presets: [],
  jsxFramework: undefined,
});
