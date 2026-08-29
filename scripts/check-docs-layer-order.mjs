#!/usr/bin/env node
/**
 * Cascade-layer documentation drift check.
 *
 *   node scripts/check-docs-layer-order.mjs   # exits non-zero on drift
 *
 * The cascade-layer guide tells people exactly where to slot motif's layer
 * relative to Tailwind's. Get that ordering wrong and the failure is silent:
 * motif either outranks every Tailwind layer, or sits under preflight, which
 * zeroes precisely the padding and margin motif set. Neither shows up as an
 * error, so a stale guide is worse than no guide.
 *
 * This asserts the two things the prose cannot enforce about itself:
 *
 *   1. The documented `@layer` statement puts the motif layer after `base`
 *      and before `components`.
 *   2. The layer name in that statement is the same one the guide's
 *      `ThemeProvider` example passes to `cssLayer`. A guide that orders
 *      `motif` while telling people to configure `motif-styles` is broken in
 *      a way no test of the emitter would catch.
 *
 * The behaviour behind the ordering is pinned separately, in a real browser,
 * by `apps/docs/tests/cascade`. Layer precedence cannot be checked in jsdom:
 * it drops the contents of `@layer` blocks entirely.
 *
 * Lives here rather than in a package test because it reads `apps/docs`, and
 * nothing under `packages/` may depend on an app.
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const GUIDE = 'apps/docs/content/guides/cascade-layers.mdx';

/**
 * The marker that identifies the guide's recommended statement. The guide
 * deliberately shows broken orderings as well, so the canonical one has to say
 * so rather than be guessed at by shape.
 */
const CANONICAL_MARKER = 'docs-check: canonical-layer-order';
/** An `@layer a, b, c;` statement. */
const LAYER_STATEMENT = /@layer\s+([a-zA-Z0-9_.-]+(?:\s*,\s*[a-zA-Z0-9_.-]+)+)\s*;/;
/** The name the guide's provider example configures. */
const PROVIDER_LAYER = /cssLayer="([^"]+)"/;

const source = readFileSync(resolve(process.cwd(), GUIDE), 'utf8');
const failures = [];

const providerMatch = PROVIDER_LAYER.exec(source);
const markerAt = source.indexOf(CANONICAL_MARKER);

if (providerMatch === null) {
  failures.push(`No \`cssLayer="…"\` example found in ${GUIDE}.`);
}
if (markerAt === -1) {
  failures.push(
    `No \`${CANONICAL_MARKER}\` marker found in ${GUIDE}. It marks the recommended ` +
      `statement, so this check cannot tell it apart from the broken orderings the guide ` +
      `also shows.`,
  );
}

if (providerMatch !== null && markerAt !== -1) {
  const configured = providerMatch[1];
  const statementMatch = LAYER_STATEMENT.exec(source.slice(markerAt));

  if (statementMatch === null) {
    failures.push(`No \`@layer a, b, …;\` statement follows the ${CANONICAL_MARKER} marker.`);
  } else {
    const names = statementMatch[1].split(',').map((n) => n.trim());
    const motif = names.indexOf(configured);
    const base = names.indexOf('base');
    const components = names.indexOf('components');

    if (motif === -1) {
      failures.push(
        `The canonical statement \`@layer ${names.join(', ')};\` never names "${configured}", ` +
          `which is what the guide's ThemeProvider example configures.`,
      );
    } else if (base === -1 || components === -1) {
      failures.push(
        `The canonical statement must name both "base" and "components" so motif can be ` +
          `positioned between them. Got: @layer ${names.join(', ')};`,
      );
    } else if (!(base < motif && motif < components)) {
      failures.push(
        `"${configured}" must sit after "base" and before "components", or Tailwind's preflight ` +
          `will zero motif's padding and margin (motif too early) or motif will outrank every ` +
          `Tailwind utility (motif too late). Got: @layer ${names.join(', ')};`,
      );
    }
  }
}

if (failures.length > 0) {
  console.error(`${GUIDE} is out of sync with the ordering motif documents:\n`);
  for (const failure of failures) console.error(`  - ${failure}`);
  console.error('\nSee apps/docs/tests/cascade for the behaviour these claims rest on.');
  process.exit(1);
}

console.log(`✓ ${GUIDE} documents a valid motif layer position.`);
