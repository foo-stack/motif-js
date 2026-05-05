import { definePlugin } from '@vorge/core/plugins';

const HEAD_INJECTION =
  '<link rel="icon" type="image/svg+xml" href="/favicon.svg">' +
  '<link rel="mask-icon" href="/favicon.svg" color="#C2410C">' +
  '<link rel="apple-touch-icon" href="/favicon.svg">' +
  '<meta name="theme-color" content="#FBF7F2" media="(prefers-color-scheme: light)">' +
  '<meta name="theme-color" content="#13110E" media="(prefers-color-scheme: dark)">' +
  '<meta property="og:type" content="website">' +
  '<meta property="og:site_name" content="motif-js">' +
  '<meta property="og:image" content="/og-default.svg">' +
  '<meta property="og:image:width" content="1200">' +
  '<meta property="og:image:height" content="630">' +
  '<meta name="twitter:card" content="summary_large_image">' +
  '<meta name="twitter:image" content="/og-default.svg">' +
  '<script>(function(){try{var t=localStorage.getItem("vorge-theme");if(!t){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.setAttribute("data-theme",t)}catch(e){}})();</script>';

export function headExtras() {
  return definePlugin({
    name: 'docs:head-extras',
    transformHtml(html) {
      return html.replace('</head>', `${HEAD_INJECTION}</head>`);
    },
  });
}
