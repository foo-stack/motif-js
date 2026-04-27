import { describe, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import { createElement, type ComponentType, type ReactNode } from 'react';
import {
  assertConformance,
  defaultTestTheme,
  standardCases,
  type ConformanceCase,
  type PrimitiveName,
  type RendererAdapter,
  type RendererOutput,
} from '@motif-js/test-utils';
import type { Theme } from '@motif-js/core';
import {
  Box,
  Container,
  HStack,
  Image,
  Pressable,
  SSRStyleCollector,
  Stack,
  Text,
  ThemeProvider,
  VStack,
} from './index.js';
import { _resetStyleCacheForTesting } from './style-cache.js';

const PRIMITIVES: Record<PrimitiveName, ComponentType<Record<string, unknown>>> = {
  Box: Box as unknown as ComponentType<Record<string, unknown>>,
  Stack: Stack as unknown as ComponentType<Record<string, unknown>>,
  HStack: HStack as unknown as ComponentType<Record<string, unknown>>,
  VStack: VStack as unknown as ComponentType<Record<string, unknown>>,
  Text: Text as unknown as ComponentType<Record<string, unknown>>,
  Container: Container as unknown as ComponentType<Record<string, unknown>>,
  Pressable: Pressable as unknown as ComponentType<Record<string, unknown>>,
  Image: Image as unknown as ComponentType<Record<string, unknown>>,
};

/**
 * Web renderer adapter for the conformance harness.
 *
 * Render flow:
 * 1. Wrap the case's primitive in a `ThemeProvider` so CSS-var refs
 *    resolve correctly.
 * 2. Run `renderToString` inside an `SSRStyleCollector` to capture
 *    every `injectAtRules` / `injectPseudoRules` emit.
 * 3. Parse the rendered HTML for the primitive's root element's inline
 *    `style` attribute.
 * 4. Parse the captured CSS for media / container / pseudo-state rules
 *    keyed by the primitive's class name.
 * 5. Back-resolve `var(--…)` references against the theme so the
 *    output uses literal values that the renderer-agnostic standard
 *    cases can compare against.
 */
function createWebAdapter(): RendererAdapter {
  return {
    name: 'react-web',
    render(c: ConformanceCase): RendererOutput {
      _resetStyleCacheForTesting();
      const theme = c.theme ?? defaultTestTheme;
      const Component = PRIMITIVES[c.primitive];
      const collector = new SSRStyleCollector();
      const html = collector.collect(() =>
        renderToString(
          createElement(
            ThemeProvider,
            { themes: [theme], active: theme.name },
            createElement(
              Component,
              c.props,
              c.children !== undefined ? (c.children as ReactNode) : undefined,
            ),
          ),
        ),
      );

      const { className, inlineStyle } = extractRoot(html);
      const css = collector.getCss();
      const { mediaRules, containerRules, pseudoRules } = parseCollectedCss(css, className);

      return {
        style: normaliseDecls(inlineStyle, theme),
        mediaRules: normaliseRuleMap(mediaRules, theme),
        containerRules: normaliseRuleMap(containerRules, theme),
        pseudoRules: normaliseRuleMap(pseudoRules, theme),
      };
    },
  };
}

/**
 * Extract the rendered primitive's root element from the SSR HTML.
 * The structure is:
 * ```
 * <style data-motif-themes>...</style>
 * <div data-theme="…">
 *   <ROOT class="m-…" style="…">…</ROOT>
 * </div>
 * ```
 */
function extractRoot(html: string): {
  className: string | null;
  inlineStyle: Record<string, string>;
} {
  // Find the inner div wrapping children — the `data-theme` div.
  const themeDivIdx = html.search(/<div data-theme="[^"]*">/);
  if (themeDivIdx === -1) return { className: null, inlineStyle: {} };
  const after = html.slice(themeDivIdx);
  // The next opening tag is the root primitive.
  const rootMatch = after.match(/<div data-theme="[^"]*">\s*<([a-z]+)([^>]*)>/);
  if (rootMatch === null) return { className: null, inlineStyle: {} };
  const attrs = rootMatch[2] ?? '';

  const classMatch = attrs.match(/\bclass="([^"]+)"/);
  const className = classMatch?.[1]?.trim() ?? null;

  const styleMatch = attrs.match(/\bstyle="([^"]*)"/);
  const inlineStyle = styleMatch !== null ? parseInlineStyle(styleMatch[1] ?? '') : {};

  return { className, inlineStyle };
}

function parseInlineStyle(s: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const decl of s.split(';')) {
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

interface ParsedRules {
  mediaRules: Record<string, Record<string, string>>;
  containerRules: Record<string, Record<string, string>>;
  pseudoRules: Record<string, Record<string, string>>;
}

/**
 * Parse the collector's CSS into three rule kinds. Only rules scoped to
 * the given `className` are included.
 *
 * The CSS shape produced by motif's style-cache is:
 * - `@media (min-width: …) { .m-xxx { decls } }`
 * - `@container [name] (min-width: …) { .m-xxx { decls } }`
 * - `.m-xxx:hover { decls }` (pseudo)
 * - `.m-xxx:disabled, .m-xxx[aria-disabled="true"] { decls }` (composite)
 */
function parseCollectedCss(css: string, className: string | null): ParsedRules {
  const out: ParsedRules = { mediaRules: {}, containerRules: {}, pseudoRules: {} };
  if (className === null) return out;
  // The class might be a space-separated list; pick a hash-shaped one.
  const cls = className.split(/\s+/).find((c) => /^m-[a-z0-9]+$/.test(c));
  if (cls === undefined) return out;
  const escapedCls = cls.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // At-rule blocks: @media (...) { .m-xxx { ... } }
  const atRuleRe = /(@(?:media|container)[^{]+?)\{\s*\.([a-z0-9-]+)\s*\{([^}]*)\}\s*\}/g;
  for (const m of css.matchAll(atRuleRe)) {
    const prefix = m[1]!.trim();
    const ruleClass = m[2]!;
    if (ruleClass !== cls) continue;
    const decls = parseDecls(m[3]!);
    if (prefix.startsWith('@media')) out.mediaRules[prefix] = decls;
    else out.containerRules[prefix] = decls;
  }

  // Pseudo blocks: .m-xxx:state { ... } or composite-selector lists
  // containing .m-xxx (e.g. ":disabled, .m-xxx[aria-disabled='true']").
  const pseudoRe = new RegExp(`(\\.${escapedCls}[^,{}]*(?:,[^,{}]+)*)\\s*\\{([^}]*)\\}`, 'g');
  for (const m of css.matchAll(pseudoRe)) {
    const selectorList = m[1]!;
    // Collapse the selector list to its pseudo suffix on the class:
    // ".m-xxx:hover" → ":hover"; ".m-xxx:disabled, .m-xxx[aria-disabled=…]"
    // → ":disabled" (use the first one for the key).
    const firstSelector = selectorList.split(',')[0]!.trim();
    if (!firstSelector.startsWith(`.${cls}`)) continue;
    const pseudoKey = firstSelector.slice(`.${cls}`.length);
    if (pseudoKey === '') continue;
    out.pseudoRules[pseudoKey] = parseDecls(m[2]!);
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

function normaliseDecls(
  decls: Record<string, string>,
  theme: Theme,
): Record<string, string | number> {
  const out: Record<string, string | number> = {};
  for (const k in decls) {
    out[k] = normaliseValue(decls[k]!, theme);
  }
  return out;
}

function normaliseRuleMap(
  rules: Record<string, Record<string, string>>,
  theme: Theme,
): Record<string, Record<string, string | number>> {
  const out: Record<string, Record<string, string | number>> = {};
  for (const k in rules) {
    out[k] = normaliseDecls(rules[k]!, theme);
  }
  return out;
}

/**
 * Resolve `var(--…)` refs back to literal token values via the theme,
 * then strip a trailing `px` so numeric values round-trip back to
 * numbers. The cross-renderer expectations use raw numbers; the web
 * renderer's CSS path emits `px`-suffixed values for length scales.
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
  // Numeric value with px → number
  const numMatch = /^(-?\d+(?:\.\d+)?)px$/.exec(resolved);
  if (numMatch !== null) return Number(numMatch[1]);
  // Pure number string → number
  if (/^-?\d+(?:\.\d+)?$/.test(resolved)) return Number(resolved);
  return resolved;
}

describe('react-web — conformance suite', () => {
  const adapter = createWebAdapter();
  for (const c of standardCases) {
    it(c.name, () => {
      _resetStyleCacheForTesting();
      assertConformance(adapter, c);
    });
  }
});
