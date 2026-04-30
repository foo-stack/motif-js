#!/usr/bin/env node
// Emit `sitemap.xml` from the prerendered output.
//
// Walks `build/client/` for `index.html` files, maps each to a public
// URL, and writes a sitemap to the build's root. Runs after pagefind
// in the `build` script so it sees the final shape of the static
// output. The site's canonical origin lives in the `SITE_ORIGIN`
// constant — change it before flipping to production.

import { readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const SITE_ORIGIN = 'https://usemotif.dev';
const BUILD_DIR = new URL('../build/client/', import.meta.url).pathname;

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const s = statSync(full);
    if (s.isDirectory()) {
      // Skip pagefind's index — it has nothing for crawlers.
      if (entry === 'pagefind' || entry === 'assets' || entry === '.vite') continue;
      out.push(...walk(full));
    } else if (entry === 'index.html') {
      out.push(full);
    }
  }
  return out;
}

const htmlFiles = walk(BUILD_DIR);

const urls = htmlFiles
  .map((file) => {
    const rel = relative(BUILD_DIR, file).replace(/\\/g, '/');
    if (rel === 'index.html') return '/';
    if (rel === '__spa-fallback.html') return null;
    if (rel.endsWith('/index.html')) return '/' + rel.slice(0, -'/index.html'.length);
    return '/' + rel.replace(/\.html$/, '');
  })
  .filter((u) => u !== null && !u.startsWith('/__'))
  .sort();

const today = new Date().toISOString().slice(0, 10);

const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls
    .map((url) => `  <url><loc>${SITE_ORIGIN}${url}</loc><lastmod>${today}</lastmod></url>`)
    .join('\n') +
  `\n</urlset>\n`;

const outPath = join(BUILD_DIR, 'sitemap.xml');
writeFileSync(outPath, xml);
console.log(`sitemap: wrote ${urls.length} URLs to ${outPath}`);
