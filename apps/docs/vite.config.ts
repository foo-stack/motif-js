import mdx from '@mdx-js/rollup';
import motifExtract from '@motif-js/compiler-swc';
import rehypeShiki from '@shikijs/rehype';
import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';
import { motifInkTheme, motifPaperTheme } from './app/styles/shiki-themes';

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
              // Custom themes that mirror the design's `.tk-*` palette —
              // warm earthy syntax (terracotta keywords, moss strings,
              // lavender numbers, slate-blue functions) instead of
              // Shiki's default vitesse colors.
              themes: {
                light: motifPaperTheme,
                dark: motifInkTheme,
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
              // Lift fenced-block metastring tokens (`filename="..."`)
              // into the meta bag for the transformer below to read.
              parseMetaString: (meta: string) => {
                if (typeof meta !== 'string' || meta.length === 0) return {};
                const out: Record<string, string> = {};
                const filename = meta.match(/filename=(?:"([^"]+)"|([^\s"]+))/);
                if (filename) {
                  out.filename = filename[1] ?? filename[2] ?? '';
                }
                return out;
              },
              // Read the parsed meta in the `pre()` transformer hook
              // and attach it as a data attribute on the rendered
              // `<pre>`. `CodeBlockShell` reads `data-filename` to
              // render the file-tab header.
              transformers: [
                {
                  // Lift the parsed `filename` from `parseMetaString`
                  // onto the rendered `<pre>`. `CodeBlockShell` reads
                  // it (under the un-prefixed `filename` prop name —
                  // hast-util-to-jsx-runtime drops the `data-` prefix
                  // on the React-side prop) to render a file-tab
                  // header above the code area.
                  name: 'motif-docs:filename-meta',
                  pre(
                    this: { options: { meta?: { filename?: string } } },
                    hast: { properties?: Record<string, unknown> },
                  ) {
                    const filename = this.options.meta?.filename;
                    if (filename !== undefined && filename !== '') {
                      hast.properties = {
                        ...hast.properties,
                        'data-filename': filename,
                      };
                    }
                  },
                },
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
