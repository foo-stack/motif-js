import { definePlugin } from '@vorge/core/plugins';

const FONT_HREF =
  'https://fonts.googleapis.com/css2' +
  '?family=Fraunces:opsz,wght,SOFT@9..144,300..900,0..100' +
  '&family=Inter:wght@400..700' +
  '&family=JetBrains+Mono:wght@400;500;700' +
  '&display=swap';

const HEAD_INJECTION =
  '<link rel="preconnect" href="https://fonts.googleapis.com">' +
  '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
  `<link rel="stylesheet" href="${FONT_HREF}">`;

export function fonts() {
  return definePlugin({
    name: 'docs:fonts',
    transformHtml(html) {
      return html.replace('</head>', `${HEAD_INJECTION}</head>`);
    },
  });
}
