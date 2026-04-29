import { parse } from '@babel/parser';
import * as t from '@babel/types';
import { describe, expect, it } from 'vitest';
import { evaluateStyledConfig, resolveStyledMergedProps } from './styled.js';

/**
 * Parse `styled(Component, <config>)` from a source snippet and return
 * the evaluated config (or `null` when the config isn't fully literal).
 */
function configFrom(source: string): ReturnType<typeof evaluateStyledConfig> {
  const file = parse(`const __ = ${source};`, { sourceType: 'module', plugins: ['jsx'] });
  const decl = file.program.body[0];
  if (!t.isVariableDeclaration(decl)) throw new Error('parse fixture failed');
  const init = decl.declarations[0]!.init;
  if (!t.isCallExpression(init)) throw new Error('expected styled() call');
  const configArg = init.arguments[1];
  if (configArg === undefined || !t.isExpression(configArg)) throw new Error('no config arg');
  return evaluateStyledConfig(configArg);
}

describe('evaluateStyledConfig', () => {
  it('extracts a base-only config', () => {
    const config = configFrom(`styled(Box, { base: { p: 4, bg: '$brand' } })`);
    expect(config?.base).toEqual({ p: 4, bg: '$brand' });
    expect(config?.variantNames.size).toBe(0);
  });

  it('extracts an explicit variant case map', () => {
    const config = configFrom(
      `styled(Box, { variants: { size: { sm: { p: 2 }, lg: { p: 8 } } } })`,
    );
    expect([...(config?.variantNames ?? [])]).toEqual(['size']);
    expect(config?.variants.size).toEqual({
      kind: 'explicit',
      cases: { sm: { p: 2 }, lg: { p: 8 } },
    });
  });

  it('marks fallback (function-form) variants as opaque', () => {
    const config = configFrom(`styled(Box, { variants: { '...size': (val) => ({ p: val }) } })`);
    expect(config?.variants.size).toEqual({ kind: 'fallback' });
    expect([...(config?.variantNames ?? [])]).toEqual(['size']);
  });

  it('extracts compoundVariants and defaultVariants', () => {
    const config = configFrom(`styled(Box, {
      variants: {
        size: { sm: { p: 2 }, lg: { p: 8 } },
        intent: { primary: { bg: 'blue' }, secondary: { bg: 'gray' } },
      },
      compoundVariants: [
        { size: 'lg', intent: 'primary', css: { fontWeight: 700 } },
      ],
      defaultVariants: { size: 'sm' },
    })`);
    expect(config?.compoundVariants).toEqual([
      { matchers: { size: 'lg', intent: 'primary' }, css: { fontWeight: 700 } },
    ]);
    expect(config?.defaultVariants).toEqual({ size: 'sm' });
  });

  it('returns null for non-literal config', () => {
    expect(configFrom(`styled(Box, dynamicConfig)`)).toBeNull();
  });

  it('returns null on unknown config keys (avoids silent drop)', () => {
    expect(configFrom(`styled(Box, { weirdKey: { p: 4 } })`)).toBeNull();
  });
});

describe('resolveStyledMergedProps', () => {
  it('returns base alone when no variants are active', () => {
    const config = configFrom(`styled(Box, { base: { p: 4 } })`)!;
    const out = resolveStyledMergedProps(config, {});
    expect(out).toEqual({ p: 4 });
  });

  it('merges base + active variant case', () => {
    const config = configFrom(
      `styled(Box, { base: { p: 4 }, variants: { size: { sm: { p: 2 }, lg: { p: 8 } } } })`,
    )!;
    expect(resolveStyledMergedProps(config, { size: 'sm' })).toEqual({ p: 2 });
    expect(resolveStyledMergedProps(config, { size: 'lg' })).toEqual({ p: 8 });
  });

  it('applies defaultVariants when the call site omits a value', () => {
    const config = configFrom(`styled(Box, {
      base: { p: 1 },
      variants: { size: { sm: { p: 2 }, lg: { p: 8 } } },
      defaultVariants: { size: 'lg' },
    })`)!;
    expect(resolveStyledMergedProps(config, {})).toEqual({ p: 8 });
  });

  it('layers compoundVariants on top when every matcher is satisfied', () => {
    const config = configFrom(`styled(Box, {
      base: { p: 1 },
      variants: {
        size: { sm: { p: 2 }, lg: { p: 8 } },
        intent: { primary: { bg: 'blue' }, secondary: { bg: 'gray' } },
      },
      compoundVariants: [
        { size: 'lg', intent: 'primary', css: { fontWeight: 700 } },
      ],
    })`)!;
    expect(resolveStyledMergedProps(config, { size: 'lg', intent: 'primary' })).toEqual({
      p: 8,
      bg: 'blue',
      fontWeight: 700,
    });
    expect(resolveStyledMergedProps(config, { size: 'sm', intent: 'primary' })).toEqual({
      p: 2,
      bg: 'blue',
    });
  });

  it('treats boolean variants ergonomically (true/false → "true"/"false" keys)', () => {
    const config = configFrom(
      `styled(Box, { variants: { rounded: { 'true': { borderRadius: 8 }, 'false': { borderRadius: 0 } } } })`,
    )!;
    expect(resolveStyledMergedProps(config, { rounded: true })).toEqual({ borderRadius: 8 });
    expect(resolveStyledMergedProps(config, { rounded: false })).toEqual({ borderRadius: 0 });
  });

  it('returns null when a variant is fallback-form (opaque to compiler)', () => {
    const config = configFrom(`styled(Box, { variants: { '...p': (v) => ({ p: v }) } })`)!;
    // Fallback form stops static resolution as soon as a value is set.
    expect(resolveStyledMergedProps(config, { p: 8 })).toBeNull();
  });

  it('returns null when an explicit variant value has no matching case', () => {
    const config = configFrom(`styled(Box, { variants: { size: { sm: { p: 2 } } } })`)!;
    expect(resolveStyledMergedProps(config, { size: 'lg' })).toBeNull();
  });
});
