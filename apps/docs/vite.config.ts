import mdx from '@mdx-js/rollup';
import motifExtract from '@motif-js/compiler-swc';
import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';

// Plugin order:
//   1. mdx (`enforce: 'pre'`) — turns .mdx files into JSX before
//      anything else sees them
//   2. reactRouter — RR7 framework mode plugin (handles JSX, routing,
//      SSG, the whole framework conventions)
//   3. motifExtract — Motif's static style-prop extractor (issue #5
//      tracks an outstanding bug where this currently no-ops on web;
//      the runtime path works regardless)
export default defineConfig({
  plugins: [
    { enforce: 'pre', ...mdx({ providerImportSource: '@mdx-js/react' }) },
    reactRouter(),
    motifExtract.vite(),
  ],
  ssr: {
    noExternal: ['@motif-js/react', '@motif-js/headless', '@motif-js/icons', '@motif-js/tokens'],
  },
});
