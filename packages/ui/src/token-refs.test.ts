import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveToken, type TokenRef } from '@usemotif/core';
import { darkTheme, lightTheme } from '@usemotif/tokens';
import { describe, expect, it } from 'vitest';

/**
 * Every `$`-reference the kit hard-codes must resolve against the shipped
 * themes - in *both* of them.
 *
 * An unresolvable ref is dropped silently, so a component that references a
 * token no theme defines renders with the state simply missing: a menu item
 * that never highlights reads as a design decision rather than a bug. The
 * dev-time warning in `@usemotif/core` catches this at runtime for consumers;
 * this test catches it before the kit ships.
 *
 * Checking both themes is the load-bearing part. A ref can resolve in light
 * and die in dark, and dark is the theme nobody screenshots.
 */

const SRC_DIR = dirname(fileURLToPath(import.meta.url));

/** A `$`-ref with at least one dotted segment. */
const TOKEN_REF = /\$[A-Za-z][A-Za-z0-9]*(?:\.[A-Za-z0-9_-]+)+/g;

/** Heads that name a real scale; anything else is an unrelated `$` in a string. */
const SCALE_HEADS: ReadonlySet<string> = new Set([
  'colors',
  'space',
  'sizes',
  'radii',
  'fontSizes',
  'fontWeights',
  'fontFamilies',
  'lineHeights',
  'letterSpacings',
  'shadows',
  'zIndices',
  'borderWidths',
  'opacities',
  'durations',
  'easings',
]);

function sourceFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...sourceFiles(full));
    } else if (/\.tsx?$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

/** Every distinct `$`-ref in the kit, mapped to the files that use it. */
function collectRefs(): Map<TokenRef, string[]> {
  const refs = new Map<TokenRef, string[]>();
  for (const file of sourceFiles(SRC_DIR)) {
    const text = readFileSync(file, 'utf8');
    for (const match of text.matchAll(TOKEN_REF)) {
      // The pattern anchors on `$`, so every match is a well-formed TokenRef.
      const ref = match[0] as TokenRef;
      const head = ref.slice(1, ref.indexOf('.'));
      if (!SCALE_HEADS.has(head)) continue;
      // A templated ref (`` `$colors.status.${intent}.tint` ``) matches only up
      // to the hole, leaving a group path that could never resolve. The
      // interpolated segment is unknowable here, so skip rather than report.
      if (text.startsWith('.$', match.index + ref.length)) continue;
      const users = refs.get(ref);
      if (users === undefined) refs.set(ref, [file]);
      else if (!users.includes(file)) users.push(file);
    }
  }
  return refs;
}

const REFS = collectRefs();

describe('@usemotif/ui token references', () => {
  // A scan that matches nothing would pass every assertion below it. The kit
  // used ~38 distinct refs when this was written; the floor only needs to be
  // low enough not to trip on ordinary churn.
  it('finds refs to check', () => {
    expect(REFS.size).toBeGreaterThan(25);
  });

  for (const theme of [lightTheme, darkTheme]) {
    it(`every ref resolves against the ${theme.name} theme`, () => {
      const unresolved: string[] = [];
      for (const [ref, files] of REFS) {
        if (resolveToken(ref, theme) === undefined) {
          const where = files.map((f) => f.slice(SRC_DIR.length + 1)).join(', ');
          unresolved.push(`${ref} — used in ${where}`);
        }
      }
      expect(unresolved).toEqual([]);
    });
  }
});
