import { describe, expect, it } from 'vitest';
import { resolveAnimationToken, resolveValue } from '@usemotif/core';
import { darkTheme, lightTheme } from './themes.js';

/**
 * The default themes must carry every scale the core style props
 * resolve against - otherwise a `$`-ref like `borderWidth="$borderWidths.thin"`
 * has nothing to resolve to on the shipped token set.
 */
describe('default themes — borderWidths + letterSpacings scales', () => {
  for (const theme of [lightTheme, darkTheme]) {
    describe(theme.name, () => {
      it('carries a borderWidths scale', () => {
        expect(theme.tokens.borderWidths).toBeDefined();
        expect(resolveValue('$borderWidths.none', theme)).toBe(0);
        expect(resolveValue('$borderWidths.hairline', theme)).toBe(0.5);
        expect(resolveValue('$borderWidths.thin', theme)).toBe(1);
        expect(resolveValue('$borderWidths.thick', theme)).toBe(2);
      });

      it('carries a letterSpacings scale', () => {
        expect(theme.tokens.letterSpacings).toBeDefined();
        expect(resolveValue('$letterSpacings.tighter', theme)).toBe(-0.8);
        expect(resolveValue('$letterSpacings.normal', theme)).toBe(0);
        expect(resolveValue('$letterSpacings.wide', theme)).toBe(0.4);
      });

      it('resolves bare refs against the scale as a default', () => {
        expect(resolveValue('$thin', theme, { defaultScale: 'borderWidths' })).toBe(1);
        expect(resolveValue('$wide', theme, { defaultScale: 'letterSpacings' })).toBe(0.4);
      });

      // Regression: the prebuilt themes shipped without the motion scales,
      // so the `animation` prop and `$durations`/`$easings` refs silently
      // no-opped on the default themes.
      it('carries durations + easings scales', () => {
        expect(theme.tokens.durations).toBeDefined();
        expect(theme.tokens.easings).toBeDefined();
        expect(resolveValue('$durations.2', theme)).toBe('150ms');
        expect(resolveValue('$easings.standard', theme)).toBe('cubic-bezier(0.4, 0, 0.2, 1)');
      });

      it('carries the animations preset scale and resolves a preset', () => {
        expect(theme.tokens.animations).toBeDefined();
        const normal = resolveAnimationToken('normal', theme);
        expect(normal).toBeDefined();
        expect(normal).toMatchObject({ duration: '$durations.3', easing: '$easings.standard' });
        expect(resolveAnimationToken('snappy', theme)).toMatchObject({ type: 'spring' });
      });
    });
  }
});

/**
 * `action.neutral` exists so `intent="neutral"` can invert between themes.
 * Wiring it to a primitive `gray` step is what made it the one intent that
 * could not: a ramp resolves to the same literal everywhere, so a neutral
 * control kept a light fill and near-black ink on a dark canvas.
 */
describe('default themes — action.neutral', () => {
  for (const theme of [lightTheme, darkTheme]) {
    describe(theme.name, () => {
      it('defines the same roles as the other intents', () => {
        for (const role of ['bg', 'fg', 'hover'] as const) {
          expect(resolveValue(`$colors.action.neutral.${role}`, theme)).toMatch(/^#[0-9a-f]{6}$/i);
        }
      });
    });
  }

  it('resolves to different literals per theme, unlike the gray ramp it replaced', () => {
    for (const role of ['bg', 'fg', 'hover'] as const) {
      const ref = `$colors.action.neutral.${role}`;
      expect(resolveValue(ref, lightTheme)).not.toBe(resolveValue(ref, darkTheme));
    }
    // The ramp the intent used to read is theme-independent - the defect.
    expect(resolveValue('$colors.gray.200', lightTheme)).toBe(
      resolveValue('$colors.gray.200', darkTheme),
    );
  });

  it('keeps the fill readable against the theme it belongs to', () => {
    // Light: a pale fill with dark ink. Dark: a dark fill with pale ink.
    expect(resolveValue('$colors.action.neutral.bg', lightTheme)).toBe('#e4e4e7');
    expect(resolveValue('$colors.action.neutral.fg', lightTheme)).toBe('#18181b');
    expect(resolveValue('$colors.action.neutral.bg', darkTheme)).toBe('#27272a');
    expect(resolveValue('$colors.action.neutral.fg', darkTheme)).toBe('#fafafa');
  });
});
