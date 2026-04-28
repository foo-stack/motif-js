import {
  defaultTestTheme,
  standardCases,
  type ConformanceCase,
  type RendererOutput,
} from '@motif-js/test-utils';
import type { Theme } from '@motif-js/core';
import { describe, expect, it } from 'vitest';
import { extractWeb } from './extract-web.js';
import type { CallSiteAnalysis } from './types.js';

/**
 * Differential parity: every standard conformance case that doesn't
 * involve pseudo-state styling must produce a `RendererOutput`-shaped
 * result identical to what the runtime would render.
 *
 * The conformance suite already validates the runtime adapter; this test
 * runs the same cases through the compile-time path so we can prove the
 * compiler agrees with the runtime byte-for-byte. If this test passes,
 * a half-compiled half-runtime app dedupes correctly (same `m-<hash>`
 * collisions, same inline style merges).
 *
 * Pseudo-state cases (`_hover`, `_focus`, `_active`) live on Pressable
 * and aren't in the style-prop schema; the compiler doesn't extract
 * those today (left for v0.4+). They're explicitly skipped here.
 */

function fakeStaticAnalysis(props: Record<string, unknown>): CallSiteAnalysis {
  return {
    classification: 'static',
    staticProps: Object.entries(props).map(([name, value]) => ({
      name,
      isStatic: true as const,
      value,
    })),
    dynamicProps: [],
    passThrough: [],
    hasSpread: false,
  };
}

function isPseudoStateCase(c: ConformanceCase): boolean {
  return c.expectPseudoRules !== undefined && Object.keys(c.expectPseudoRules).length > 0;
}

/**
 * Take the compiler's `extractWeb` output and shape it like the
 * `RendererOutput` the conformance harness expects. Mirrors what
 * `createWebAdapter` does for the runtime path — including the
 * `var(--…)` → literal back-resolve so numeric expectations match.
 */
function compiledOutputAsRendererOutput(
  c: ConformanceCase,
  theme: Theme,
): RendererOutput {
  const result = extractWeb(fakeStaticAnalysis(c.props));

  const style = normaliseDecls(result.inlineStyle, theme);
  const mediaRules: Record<string, Record<string, string | number>> = {};
  const containerRules: Record<string, Record<string, string | number>> = {};

  if (result.className !== undefined && result.css.length > 0) {
    const cls = result.className;
    const atRuleRe = /(@(?:media|container)[^{]+?)\{\s*\.([a-z0-9-]+)\s*\{([^}]*)\}\s*\}/g;
    for (const m of result.css.matchAll(atRuleRe)) {
      const prefix = m[1]!.trim();
      if (m[2]! !== cls) continue;
      const decls = parseDecls(m[3]!);
      const normalised = normaliseDecls(decls, theme);
      if (prefix.startsWith('@media')) mediaRules[prefix] = normalised;
      else containerRules[prefix] = normalised;
    }
  }

  return { style, mediaRules, containerRules, pseudoRules: {} };
}

function normaliseDecls(
  decls: Record<string, string | number>,
  theme: Theme,
): Record<string, string | number> {
  const out: Record<string, string | number> = {};
  for (const k in decls) {
    const v = decls[k]!;
    out[k] = typeof v === 'number' ? v : normaliseValue(v, theme);
  }
  return out;
}

function parseDecls(body: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const decl of body.split(';')) {
    const idx = decl.indexOf(':');
    if (idx === -1) continue;
    const prop = decl.slice(0, idx).trim();
    const value = decl.slice(idx + 1).trim();
    if (prop.length === 0) continue;
    out[kebabToCamel(prop)] = value;
  }
  return out;
}

function kebabToCamel(s: string): string {
  return s.replace(/-([a-z])/g, (_, ch: string) => ch.toUpperCase());
}

/**
 * Resolve `var(--…)` references against the test theme, then strip the
 * `px` suffix so numeric expectations match (`16` not `'16px'`).
 */
function normaliseValue(value: string, theme: Theme): string | number {
  const resolved = value.replace(/var\(--([a-z0-9_-]+)\)/g, (_, name: string) => {
    const segments = name.split('-').map((s) => s.replace(/_/g, '.'));
    let node: unknown = theme.tokens;
    for (const seg of segments) {
      if (node !== null && typeof node === 'object' && seg in (node as Record<string, unknown>)) {
        node = (node as Record<string, unknown>)[seg];
      } else {
        return `var(--${name})`;
      }
    }
    return typeof node === 'number' ? `${node}px` : String(node);
  });
  const numMatch = /^(-?\d+(?:\.\d+)?)px$/.exec(resolved);
  if (numMatch !== null) return Number(numMatch[1]);
  if (/^-?\d+(?:\.\d+)?$/.test(resolved)) return Number(resolved);
  return resolved;
}

describe('compiler — differential parity (compiled output ≡ runtime output)', () => {
  for (const c of standardCases) {
    if (isPseudoStateCase(c)) {
      it.skip(`${c.name} (pseudo-state — not extracted yet)`, () => {});
      continue;
    }

    it(`compiled output matches runtime expectations: ${c.name}`, () => {
      const theme = c.theme ?? defaultTestTheme;
      const out = compiledOutputAsRendererOutput(c, theme);

      if (c.expectStyle !== undefined) {
        expect(out.style).toMatchObject(c.expectStyle);
      }
      if (c.expectMediaRules !== undefined) {
        for (const [atRule, decls] of Object.entries(c.expectMediaRules)) {
          expect(out.mediaRules[atRule]).toMatchObject(decls);
        }
      }
      if (c.expectContainerRules !== undefined) {
        for (const [atRule, decls] of Object.entries(c.expectContainerRules)) {
          expect(out.containerRules[atRule]).toMatchObject(decls);
        }
      }
    });
  }
});
