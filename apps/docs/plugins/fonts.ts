import { definePlugin } from '@vorge/core/plugins';

// Self-hosted webfonts. The @font-face declarations live in
// apps/docs/theme/fonts.css and are bundled into the client CSS by Vite.
// We preload the latin-only critical-path faces so the browser starts
// fetching them in parallel with the HTML parse, ahead of CSS discovering
// them.
const HEAD_INJECTION =
  '<link rel="preload" href="/fonts/fraunces-latin-300_900.woff2" as="font" type="font/woff2" crossorigin>' +
  '<link rel="preload" href="/fonts/inter-latin-400_700.woff2" as="font" type="font/woff2" crossorigin>';

export function fonts() {
  return definePlugin({
    name: 'docs:fonts',
    transformHtml(html) {
      return html.replace('</head>', `${HEAD_INJECTION}</head>`);
    },
  });
}
