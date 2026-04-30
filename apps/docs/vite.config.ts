import mdx from '@mdx-js/rollup';
import motifExtract from '@motif-js/compiler-swc';
import rehypeShiki from '@shikijs/rehype';
import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';

// Plugin order:
//   1. mdx (`enforce: 'pre'`) — turns .mdx files into JSX before
//      anything else sees them. We pass `rehypeShiki` so fenced
//      code blocks get syntax-highlighted at MDX-compile time.
//   2. reactRouter — RR7 framework mode plugin (handles JSX, routing,
//      SSG, the whole framework conventions).
//   3. motifExtract — Motif's static style-prop extractor; emits the
//      aggregated atomic CSS into `virtual:motif-extract.css`.
export default defineConfig({
  plugins: [
    {
      enforce: 'pre',
      ...mdx({
        providerImportSource: '@mdx-js/react',
        rehypePlugins: [
          [
            rehypeShiki,
            {
              // Multi-theme mode: Shiki emits CSS variables on token
              // spans; the active theme is selected by the CSS class
              // on a parent element. We set that class via the
              // `[data-theme="paper"]` / `[data-theme="ink"]` selectors
              // in the brand stylesheet (see `code-shiki.css`).
              themes: {
                light: 'vitesse-light',
                dark: 'vitesse-dark',
              },
              defaultColor: false,
              cssVariablePrefix: '--shiki-',
              // Languages we expect to need across the docs. Adding
              // here keeps the bundle deterministic — shiki dynamic
              // loads otherwise but those imports won't survive RR7's
              // SSG pre-bundling cleanly.
              langs: [
                'tsx',
                'ts',
                'jsx',
                'js',
                'json',
                'sh',
                'bash',
                'css',
                'html',
                'mdx',
                'md',
                'diff',
              ],
            },
          ],
        ],
      }),
    },
    reactRouter(),
    motifExtract.vite(),
  ],
  ssr: {
    noExternal: ['@motif-js/react', '@motif-js/headless', '@motif-js/icons', '@motif-js/tokens'],
  },
  server: { host: true, open: true },
});
