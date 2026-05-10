import {
  defaultTestTheme,
  standardCases,
  type ConformanceCase,
  type RendererOutput,
} from '@motif-js/test-utils';
import { isMotionProp, type MotionPropName, type Theme } from '@motif-js/core';
import { describe, expect, it } from 'vitest';
import { extractWeb } from './extract-web.js';
import type { CallSiteAnalysis, MotionPropAnalysis, PseudoStateAnalysis } from './types.js';

const PSEUDO_STATE_PROPS: Readonly<Record<string, string>> = {
  _hover: ':hover',
  _focus: ':focus-visible',
  _active: ':active',
  _disabled: ':disabled, &[aria-disabled="true"]',
};

/**
 * Differential parity: every standard conformance case must produce a
 * `RendererOutput`-shaped result identical to what the runtime would
 * render — including Pressable pseudo-state cases now that the compiler
 * extracts those.
 *
 * The conformance suite already validates the runtime adapter; this test
 * runs the same cases through the compile-time path so we can prove the
 * compiler agrees with the runtime byte-for-byte. If this test passes,
 * a half-compiled half-runtime app dedupes correctly (same `m-<hash>`
 * collisions, same inline style merges).
 */

function fakeStaticAnalysis(props: Record<string, unknown>): CallSiteAnalysis {
  const staticProps: CallSiteAnalysis['staticProps'][number][] = [];
  const pseudoStateProps: PseudoStateAnalysis[] = [];
  const motionProps: MotionPropAnalysis[] = [];
  for (const [name, value] of Object.entries(props)) {
    const pseudo = PSEUDO_STATE_PROPS[name];
    if (
      pseudo !== undefined &&
      typeof value === 'object' &&
      value !== null &&
      !Array.isArray(value)
    ) {
      pseudoStateProps.push({ name, pseudo, style: value as Record<string, unknown> });
      continue;
    }
    if (isMotionProp(name)) {
      motionProps.push({ name: name as MotionPropName, value });
      continue;
    }
    staticProps.push({ name, isStatic: true as const, value });
  }
  return {
    classification: 'static',
    staticProps,
    dynamicProps: [],
    passThrough: [],
    pseudoStateProps,
    motionProps,
    hasSpread: false,
  };
}

/**
 * Take the compiler's `extractWeb` output and shape it like the
 * `RendererOutput` the conformance harness expects. Mirrors what
 * `createWebAdapter` does for the runtime path — including the
 * `var(--…)` → literal back-resolve so numeric expectations match.
 */
function compiledOutputAsRendererOutput(c: ConformanceCase, theme: Theme): RendererOutput {
  const result = extractWeb(fakeStaticAnalysis(c.props));

  const inlineStyle = normaliseDecls(result.inlineStyle, theme);
  let baseClassRule: Record<string, string | number> = {};
  const mediaRules: Record<string, Record<string, string | number>> = {};
  const containerRules: Record<string, Record<string, string | number>> = {};
  const pseudoRules: Record<string, Record<string, string | number>> = {};

  if (result.className !== undefined && result.css.length > 0) {
    const classes = new Set(result.className.split(/\s+/));
    const atRuleRe = /(@(?:media|container)[^{]+?)\{\s*\.([a-z0-9-]+)\s*\{([^}]*)\}\s*\}/g;
    for (const m of result.css.matchAll(atRuleRe)) {
      const prefix = m[1]!.trim();
      if (!classes.has(m[2]!)) continue;
      const decls = parseDecls(m[3]!);
      const normalised = normaliseDecls(decls, theme);
      if (prefix.startsWith('@media')) mediaRules[prefix] = normalised;
      else containerRules[prefix] = normalised;
    }

    // Pseudo blocks: `.m-abc:hover { decls }` (no `&`) or selector lists
    // including `.m-abc[aria-disabled="true"]` (when `&` was used). We
    // recover the pseudo selector by stripping the class prefix. The
    // bare `.m-abc { decls }` block (1.6 base class block) lands in
    // baseClassRule rather than pseudoRules. Strip @media / @container
    // wrappers first so their inner `.m-abc { decls }` doesn't show
    // up here as a phantom base block.
    const cssOutsideAtRules = result.css.replace(
      /@(?:media|container)[^{]+\{(?:[^{}]|\{[^{}]*\})*\}/g,
      '',
    );
    const pseudoRe = /(\.[a-z0-9-][^{]+?)\{([^}]*)\}/g;
    for (const m of cssOutsideAtRules.matchAll(pseudoRe)) {
      const selector = m[0]!.split('{')[0]!.trim();
      if (selector.startsWith('@')) continue; // already handled above
      let referenced: string | undefined;
      for (const cls of classes) {
        if (selector.includes(`.${cls}`)) {
          referenced = cls;
          break;
        }
      }
      if (referenced === undefined) continue;
      const normalisedSel = selector.replace(new RegExp(`\\.${referenced}`, 'g'), '&').trim();
      const simple = /^&(:[\w-()]+)$/.exec(normalisedSel);
      const pseudoKey = simple !== null ? simple[1]! : normalisedSel.replace(/^&/, '');
      const decls = parseDecls(m[2]!);
      const normalised = normaliseDecls(decls, theme);
      if (pseudoKey === '') {
        baseClassRule = normalised;
      } else {
        pseudoRules[pseudoKey] = normalised;
      }
    }
  }

  // Inline overrides class block on key collision (matches CSS cascade
  // behavior at runtime — inline beats class for the same property).
  const style = { ...baseClassRule, ...inlineStyle };

  return { style, baseClassRule, mediaRules, containerRules, pseudoRules };
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
    if (c.skipOnRenderer?.includes('compiler') === true) {
      it.skip(`compiled output matches runtime expectations: ${c.name}`, () => {});
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
      if (c.expectPseudoRules !== undefined) {
        for (const [pseudo, decls] of Object.entries(c.expectPseudoRules)) {
          expect(out.pseudoRules[pseudo]).toMatchObject(decls);
        }
      }
    });
  }
});
