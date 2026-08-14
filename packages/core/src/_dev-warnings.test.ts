import { afterEach, describe, expect, it, vi } from 'vitest';
import { _resetDevWarningsForTesting } from './_dev-warnings.js';
import { resolveToken } from './token.js';
import type { Theme } from './types.js';

const theme: Theme = {
  name: 'test',
  tokens: {
    colors: {
      gray: { 50: '#f9fafb', 900: '#111827' },
      surface: { base: '$colors.gray.50', raised: '$colors.gray.900' },
    },
    space: { 1: 4, 2: 8 },
  },
};

afterEach(() => {
  _resetDevWarningsForTesting();
  vi.restoreAllMocks();
});

function captureWarnings(fn: () => void): string[] {
  const spy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
  fn();
  return spy.mock.calls.map((c) => String(c[0]));
}

describe('unresolved `$`-ref warning', () => {
  it('names the sibling keys available at the deepest node that resolved', () => {
    const [msg] = captureWarnings(() => resolveToken('$colors.surface.default', theme));

    expect(msg).toContain('$colors.surface.default');
    expect(msg).toContain('theme "test"');
    // The actionable half: what the group *does* offer.
    expect(msg).toContain('`colors.surface` has no `default`');
    expect(msg).toContain('available: base, raised');
  });

  it('reports a missing scale against the scales the theme does define', () => {
    const [msg] = captureWarnings(() => resolveToken('$nope.thing', theme));

    expect(msg).toContain('no `nope` scale');
    expect(msg).toContain('available: colors, space');
  });

  it('flags a group used where a value was expected', () => {
    const [msg] = captureWarnings(() => resolveToken('$colors.surface', theme));

    expect(msg).toContain('is a group, not a value');
    expect(msg).toContain('contains: base, raised');
  });

  it('does not warn for a key whose name contains a dot — those now resolve', () => {
    const dotted: Theme = { name: 'dotted', tokens: { space: { '1.5': 6 } } };
    const msgs = captureWarnings(() => {
      expect(resolveToken('$space.1.5', dotted)).toBe(6);
    });

    expect(msgs).toHaveLength(0);
  });

  it('still warns for a dotted key the theme does not define', () => {
    const dotted: Theme = { name: 'dotted', tokens: { space: { '1.5': 6 } } };
    const [msg] = captureWarnings(() => resolveToken('$space.9.5', dotted));

    expect(msg).toContain('$space.9.5');
    expect(msg).toContain('available: 1.5');
  });

  it('warns once per (theme, ref) pair, not once per resolve', () => {
    const msgs = captureWarnings(() => {
      resolveToken('$colors.surface.default', theme);
      resolveToken('$colors.surface.default', theme);
      resolveToken('$colors.surface.default', theme);
    });

    expect(msgs).toHaveLength(1);
  });

  it('warns again for the same ref under a different theme', () => {
    const other: Theme = { name: 'other', tokens: theme.tokens };
    const msgs = captureWarnings(() => {
      resolveToken('$colors.surface.default', theme);
      resolveToken('$colors.surface.default', other);
    });

    expect(msgs).toHaveLength(2);
  });

  it('stays silent when the ref resolves', () => {
    const msgs = captureWarnings(() => {
      expect(resolveToken('$colors.surface.base', theme)).toBe('#f9fafb');
      expect(resolveToken('$space.2', theme)).toBe(8);
    });

    expect(msgs).toEqual([]);
  });

  it('no-ops in production', () => {
    const prev = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    try {
      const msgs = captureWarnings(() => resolveToken('$colors.surface.default', theme));
      expect(msgs).toEqual([]);
    } finally {
      process.env.NODE_ENV = prev;
    }
  });
});
