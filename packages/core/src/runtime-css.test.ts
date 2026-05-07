import { describe, expect, it } from 'vitest';
import {
  fontFacesToCss,
  reducedMotionGuardCss,
  rootResetsToCss,
  themesRuntimeCss,
} from './runtime-css.js';
import type { Theme } from './types.js';

const inter: Theme = {
  name: 'light',
  tokens: { colors: { bg: { base: '#fff' } } },
  fonts: [
    {
      family: 'Inter',
      src: [{ url: '/fonts/inter.woff2', format: 'woff2' }],
      weight: '400 700',
      style: 'normal',
      display: 'swap',
      unicodeRange: 'U+0000-00FF',
    },
  ],
  root: {
    background: '$colors.bg.base',
    color: '$colors.text.primary',
    fontFamily: '$fontFamilies.body',
    selectionBackground: '$colors.accent.base',
    selectionColor: '#fff',
  },
  reducedMotion: 'guard',
};

const interDark: Theme = {
  name: 'dark',
  tokens: { colors: { bg: { base: '#000' } } },
  // Same Inter face as `inter` — tests dedupe across themes.
  fonts: [
    {
      family: 'Inter',
      src: [{ url: '/fonts/inter.woff2', format: 'woff2' }],
      weight: '400 700',
      style: 'normal',
      display: 'swap',
      unicodeRange: 'U+0000-00FF',
    },
  ],
};

describe('fontFacesToCss', () => {
  it('emits one @font-face per registered face', () => {
    const css = fontFacesToCss([inter]);
    expect(css).toContain('@font-face {');
    expect(css).toContain('font-family: Inter;');
    expect(css).toContain("src: url('/fonts/inter.woff2') format('woff2');");
    expect(css).toContain('font-weight: 400 700;');
    expect(css).toContain('font-style: normal;');
    expect(css).toContain('font-display: swap;');
    expect(css).toContain('unicode-range: U+0000-00FF;');
  });

  it('quotes families that contain spaces or punctuation', () => {
    const css = fontFacesToCss([
      {
        name: 't',
        tokens: {},
        fonts: [{ family: 'JetBrains Mono', src: '/jbm.woff2' }],
      },
    ]);
    expect(css).toContain("font-family: 'JetBrains Mono';");
  });

  it('accepts a bare URL string as src shorthand', () => {
    const css = fontFacesToCss([
      { name: 't', tokens: {}, fonts: [{ family: 'Inter', src: '/inter.woff2' }] },
    ]);
    expect(css).toContain("src: url('/inter.woff2');");
  });

  it('emits multiple sources comma-separated when given an array', () => {
    const css = fontFacesToCss([
      {
        name: 't',
        tokens: {},
        fonts: [
          {
            family: 'X',
            src: [
              { url: '/x.woff2', format: 'woff2' },
              { url: '/x.woff', format: 'woff' },
            ],
          },
        ],
      },
    ]);
    expect(css).toContain("url('/x.woff2') format('woff2')");
    expect(css).toContain("url('/x.woff') format('woff')");
    expect(css.indexOf("url('/x.woff2')")).toBeLessThan(css.indexOf("url('/x.woff')"));
  });

  it('emits font-variation-settings + font-feature-settings when supplied', () => {
    const css = fontFacesToCss([
      {
        name: 't',
        tokens: {},
        fonts: [
          {
            family: 'Fraunces',
            src: '/f.woff2',
            fontVariationSettings: '"opsz" 144',
            fontFeatureSettings: '"ss01"',
          },
        ],
      },
    ]);
    expect(css).toContain('font-variation-settings: "opsz" 144;');
    expect(css).toContain('font-feature-settings: "ss01";');
  });

  it('dedupes identical faces across themes', () => {
    const css = fontFacesToCss([inter, interDark]);
    const matches = css.match(/@font-face/g) ?? [];
    expect(matches.length).toBe(1);
  });

  it('returns empty string when no theme defines fonts', () => {
    expect(fontFacesToCss([{ name: 't', tokens: {} }])).toBe('');
  });
});

describe('rootResetsToCss', () => {
  it('emits body declarations using var() for token references', () => {
    const css = rootResetsToCss([inter]);
    expect(css).toContain('body {');
    expect(css).toContain('background-color: var(--colors-bg-base);');
    expect(css).toContain('color: var(--colors-text-primary);');
    expect(css).toContain('font-family: var(--fontFamilies-body);');
  });

  it('emits a separate ::selection block when selection slots are set', () => {
    const css = rootResetsToCss([inter]);
    expect(css).toContain('::selection {');
    expect(css).toContain('background-color: var(--colors-accent-base);');
    expect(css).toContain('color: #fff;');
  });

  it('first theme wins per-property when themes disagree', () => {
    const a: Theme = {
      name: 'a',
      tokens: {},
      root: { background: '$colors.surface.base', color: '$colors.text.muted' },
    };
    const b: Theme = {
      name: 'b',
      tokens: {},
      root: { background: '$colors.surface.raised', fontFamily: '$fontFamilies.mono' },
    };
    const css = rootResetsToCss([a, b]);
    // a's background wins; b's fontFamily fills the gap.
    expect(css).toContain('background-color: var(--colors-surface-base);');
    expect(css).not.toContain('--colors-surface-raised');
    expect(css).toContain('font-family: var(--fontFamilies-mono);');
  });

  it('passes through literal CSS values', () => {
    const css = rootResetsToCss([
      {
        name: 't',
        tokens: {},
        root: { background: '#fafafa', fontSize: '16px', WebkitFontSmoothing: 'antialiased' },
      },
    ]);
    expect(css).toContain('background-color: #fafafa;');
    expect(css).toContain('font-size: 16px;');
    expect(css).toContain('-webkit-font-smoothing: antialiased;');
  });

  it('returns empty string when no theme defines root', () => {
    expect(rootResetsToCss([{ name: 't', tokens: {} }])).toBe('');
  });
});

describe('reducedMotionGuardCss', () => {
  it('emits the @media block when any theme requests guard', () => {
    const css = reducedMotionGuardCss([inter]);
    expect(css).toContain('@media (prefers-reduced-motion: reduce)');
    expect(css).toContain('animation-duration: 0.01ms !important');
    expect(css).toContain('transition-duration: 0.01ms !important');
    expect(css).toContain('scroll-behavior: auto !important');
  });

  it('emits when at least one theme of a set wants the guard', () => {
    const css = reducedMotionGuardCss([
      { name: 'a', tokens: {} },
      { name: 'b', tokens: {}, reducedMotion: 'guard' },
    ]);
    expect(css).toContain('@media (prefers-reduced-motion: reduce)');
  });

  it('returns empty string when no theme requests guard', () => {
    expect(reducedMotionGuardCss([{ name: 't', tokens: {} }])).toBe('');
    expect(reducedMotionGuardCss([{ name: 't', tokens: {}, reducedMotion: 'off' }])).toBe('');
  });
});

describe('themesRuntimeCss', () => {
  it('concatenates fonts + resets + guard, separated by blank lines', () => {
    const css = themesRuntimeCss([inter]);
    expect(css).toContain('@font-face');
    expect(css).toContain('body {');
    expect(css).toContain('::selection {');
    expect(css).toContain('@media (prefers-reduced-motion: reduce)');
    // Sections separated by blank lines.
    const fontIdx = css.indexOf('@font-face');
    const bodyIdx = css.indexOf('body {');
    const guardIdx = css.indexOf('@media');
    expect(fontIdx).toBeLessThan(bodyIdx);
    expect(bodyIdx).toBeLessThan(guardIdx);
  });

  it('omits empty sections', () => {
    const css = themesRuntimeCss([{ name: 't', tokens: {}, reducedMotion: 'guard' }]);
    expect(css).toContain('@media (prefers-reduced-motion: reduce)');
    expect(css).not.toContain('@font-face');
    expect(css).not.toContain('body {');
  });

  it('returns empty string when nothing to emit', () => {
    expect(themesRuntimeCss([{ name: 't', tokens: {} }])).toBe('');
  });
});
