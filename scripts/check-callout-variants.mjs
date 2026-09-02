#!/usr/bin/env node
/**
 * Callout variant check for the docs.
 *
 *   node scripts/check-callout-variants.mjs   # exits non-zero on an unknown variant
 *
 * MDX is not typechecked. A page can pass any string to a component prop, and
 * nothing between the author and the browser looks at it. That is not
 * hypothetical here: one mistyped word shipped four documentation pages blank
 * for months, the visual baselines recorded the blank pages as the expected
 * result, and it was eventually found by grep rather than by any check.
 *
 * The component no longer crashes on an unknown variant, so the failure mode
 * changed rather than disappeared: a mistyped `danger` now renders as a neutral
 * note and quietly loses the severity the author intended. A development-only
 * warning tells whoever is editing the page. This tells CI.
 *
 * The union is read out of the component rather than repeated here. A check
 * that carries its own copy of the thing it validates drifts from it, and then
 * it is the check that is wrong.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(import.meta.url), '..', '..');
const DOCS = join(ROOT, 'apps', 'docs');
const COMPONENT = join(DOCS, 'components', 'Callout.tsx');
// `.vorge` is the docs site's build output. A stale generated page under there
// would fail this check on a file nobody can fix by editing.
const SKIP = new Set([
  'node_modules',
  'dist',
  '.vorge',
  '.next',
  'test-results',
  'playwright-report',
]);

/** The declared union, taken from the component's own runtime list. */
function readVariants() {
  const source = readFileSync(COMPONENT, 'utf8');
  const match = /export const CALLOUT_VARIANTS = \[([^\]]*)\] as const;/.exec(source);
  if (match === null) {
    throw new Error(
      `Could not find CALLOUT_VARIANTS in ${relative(ROOT, COMPONENT)}. This check reads the ` +
        `union from the component; if that export moved or was renamed, update this check ` +
        `rather than inlining the list here.`,
    );
  }
  const variants = [...match[1].matchAll(/'([^']+)'/g)].map((m) => m[1]);
  if (variants.length === 0) throw new Error('CALLOUT_VARIANTS is empty.');
  return variants;
}

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (SKIP.has(entry)) continue;
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) yield* walk(path);
    else if (entry.endsWith('.mdx')) yield path;
  }
}

const variants = readVariants();
const known = new Set(variants);
const offenders = [];
const expressions = [];
let checked = 0;
let files = 0;

for (const path of walk(DOCS)) {
  const source = readFileSync(path, 'utf8');
  if (!source.includes('<Callout')) continue;
  files += 1;
  const lines = source.split('\n');
  lines.forEach((line, index) => {
    for (const tag of line.matchAll(/<Callout\b([^>]*)>/g)) {
      const attrs = tag[1];
      const literal = /\bvariant\s*=\s*"([^"]*)"/.exec(attrs);
      if (literal !== null) {
        checked += 1;
        if (!known.has(literal[1])) {
          offenders.push(`${relative(ROOT, path)}:${index + 1} → variant="${literal[1]}"`);
        }
        continue;
      }
      // A variant passed as an expression cannot be read statically. Reported
      // rather than ignored, so the count below is honest about what it covers.
      if (/\bvariant\s*=\s*\{/.test(attrs)) {
        expressions.push(`${relative(ROOT, path)}:${index + 1}`);
      }
    }
  });
}

if (offenders.length > 0) {
  console.error(`callout: ${offenders.length} unknown variant(s).\n`);
  for (const offender of offenders) console.error(`  ${offender}`);
  console.error(`\nKnown variants: ${variants.join(', ')}.`);
  console.error('An unknown one renders as "info" and loses the severity the page intended.');
  process.exit(1);
}

// An empty run means the walk found nothing, which is a broken check rather
// than a clean repository: this component is used on well over a hundred pages.
if (checked === 0) {
  console.error(
    'callout: no <Callout variant="..."> found anywhere under apps/docs. ' +
      'The component is used widely, so this means the walk or the pattern is broken.',
  );
  process.exit(1);
}

console.log(`callout: ${checked} variant(s) across ${files} page(s) are all declared.`);
if (expressions.length > 0) {
  console.log(`  ${expressions.length} passed as an expression and cannot be checked statically:`);
  for (const where of expressions) console.log(`    ${where}`);
}
