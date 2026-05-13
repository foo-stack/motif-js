import { definePlugin } from '@vorge/core/plugins';

const HEAD_INJECTION =
  '<link rel="icon" type="image/svg+xml" href="/favicon.svg">' +
  '<link rel="mask-icon" href="/favicon.svg" color="#C2410C">' +
  '<link rel="apple-touch-icon" href="/favicon.svg">' +
  '<meta name="theme-color" content="#FBF7F2" media="(prefers-color-scheme: light)">' +
  '<meta name="theme-color" content="#13110E" media="(prefers-color-scheme: dark)">' +
  '<meta property="og:type" content="website">' +
  '<meta property="og:site_name" content="motif-js">' +
  '<meta property="og:image" content="/og-default.png">' +
  '<meta property="og:image:type" content="image/png">' +
  '<meta property="og:image:width" content="1200">' +
  '<meta property="og:image:height" content="630">' +
  '<meta name="twitter:card" content="summary_large_image">' +
  '<meta name="twitter:image" content="/og-default.png">';
// Pre-paint theme-init script is emitted by vorge's own template
// (`renderThemeInitScript()` from @vorge/core/theme). We previously
// duplicated it here, which did no harm but was dead bytes.

export function headExtras() {
  return definePlugin({
    name: 'docs:head-extras',
    transformHtml(html) {
      return html.replace('</head>', `${HEAD_INJECTION}</head>`);
    },
  });
}
