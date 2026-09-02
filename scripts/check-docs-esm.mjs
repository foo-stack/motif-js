#!/usr/bin/env node
/**
 * ESM consistency check for the docs.
 *
 *   node scripts/check-docs-esm.mjs   # exits non-zero on a contradiction
 *
 * Two failures this catches, both of which have already happened.
 *
 * A page showing `require('<pkg>')` for a package that publishes no `require`
 * condition. `@usemotif/compiler-web` documented that exact call while its own
 * dependency made it impossible, so the documented setup threw
 * ERR_REQUIRE_ESM on the oldest supported Node. Nothing noticed, because a
 * documentation example is not built.
 *
 * A page naming the same config file with two different extensions. The webpack
 * guide said to name the config `webpack.config.mjs` because the package is ESM
 * only, and forty lines later showed `webpack.config.js`. A reader following the
 * lower block gets the error the upper block exists to prevent.
 *
 * The ESM-only package list is read from the manifests rather than hardcoded, so
 * a package that gains or loses a `require` condition changes what this checks
 * without anyone editing it.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(import.meta.url), '..', '..');
const DOCS = join(ROOT, 'apps', 'docs');
const SKIP = new Set([
  'node_modules',
  'dist',
  '.vorge',
  '.next',
  'test-results',
  'playwright-report',
]);

/** Publishable packages whose exports offer no `require` condition. */
function esmOnlyPackages() {
  const names = [];
  for (const dir of readdirSync(join(ROOT, 'packages'))) {
    const manifestPath = join(ROOT, 'packages', dir, 'package.json');
    let manifest;
    try {
      manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    } catch {
      continue;
    }
    if (manifest.private) continue;
    const serialized = JSON.stringify(manifest.exports ?? {});
    if (!serialized.includes('"require"')) names.push(manifest.name);
  }
  return names;
}

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (SKIP.has(entry)) continue;
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) yield* walk(path);
    else if (entry.endsWith('.mdx')) yield path;
  }
}

const esmOnly = esmOnlyPackages();
const offenders = [];
let pages = 0;

for (const path of walk(DOCS)) {
  const source = readFileSync(path, 'utf8');
  const where = relative(ROOT, path);
  pages += 1;

  for (const name of esmOnly) {
    const called = new RegExp(`require\\(\\s*['"]${name.replace('/', '\\/')}['"]`);
    if (called.test(source)) {
      offenders.push(
        `${where} shows require('${name}'), but that package publishes no require condition.`,
      );
    }
  }

  // The same config file named two ways on one page is a contradiction whatever
  // the reason: one of the two blocks is wrong for the reader who copies it.
  const named = new Map();
  for (const match of source.matchAll(/filename="([^"]+)\.(m?js|cjs)"/g)) {
    const stem = match[1];
    if (!named.has(stem)) named.set(stem, new Set());
    named.get(stem).add(match[2]);
  }
  for (const [stem, extensions] of named) {
    if (extensions.size > 1) {
      offenders.push(
        `${where} names ${stem} with more than one extension (${[...extensions].sort().join(', ')}).`,
      );
    }
  }
}

if (offenders.length > 0) {
  console.error(`docs-esm: ${offenders.length} contradiction(s).\n`);
  for (const offender of offenders) console.error(`  ${offender}`);
  process.exit(1);
}

if (pages === 0) {
  console.error('docs-esm: no .mdx pages found under apps/docs. The walk is broken.');
  process.exit(1);
}

console.log(
  `docs-esm: ${pages} page(s) consistent. ESM-only packages checked: ${esmOnly.join(', ') || 'none'}.`,
);
