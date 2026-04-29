import { describe, expect, it } from 'vitest';
import { resolveTransition, resolveTransitionToVars } from './motion.js';
import { MOTION_PROP_NAMES, MOTION_PROPS, isMotionProp } from './style-props.js';
import type { Theme } from './types.js';

const theme: Theme = {
  name: 'test',
  tokens: {
    durations: { 0: '0ms', 2: '150ms', 3: '200ms', 5: '500ms' },
    easings: {
      standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
      linear: 'linear',
    },
  },
};

describe('motion prop schema', () => {
  it('exposes the three prop names', () => {
    expect(MOTION_PROP_NAMES).toEqual(['enterStyle', 'exitStyle', 'transition']);
  });

  it('isMotionProp accepts the three names and rejects others', () => {
    expect(isMotionProp('enterStyle')).toBe(true);
    expect(isMotionProp('exitStyle')).toBe(true);
    expect(isMotionProp('transition')).toBe(true);
    expect(isMotionProp('_hover')).toBe(false);
    expect(isMotionProp('p')).toBe(false);
    expect(MOTION_PROPS.size).toBe(3);
  });
});

describe('resolveTransition (literal mode)', () => {
  it('passes through raw CSS string', () => {
    expect(resolveTransition('opacity 200ms ease', undefined)).toBe('opacity 200ms ease');
  });

  it('returns undefined for undefined input', () => {
    expect(resolveTransition(undefined, undefined)).toBeUndefined();
  });

  it('renders a single transition object with defaults', () => {
    expect(resolveTransition({ property: 'opacity' }, undefined)).toBe('opacity 200ms ease');
  });

  it('honours an explicit duration and easing', () => {
    expect(
      resolveTransition({ property: 'opacity', duration: '300ms', easing: 'linear' }, undefined),
    ).toBe('opacity 300ms linear');
  });

  it('appends delay only when set', () => {
    expect(
      resolveTransition({ property: 'transform', duration: '150ms', delay: '100ms' }, undefined),
    ).toBe('transform 150ms ease 100ms');
  });

  it('resolves $durations.<n> token refs against theme', () => {
    expect(resolveTransition({ property: 'opacity', duration: '$durations.3' }, theme)).toBe(
      'opacity 200ms ease',
    );
  });

  it('resolves $easings.<name> token refs against theme', () => {
    expect(
      resolveTransition(
        { property: 'opacity', duration: '$durations.2', easing: '$easings.standard' },
        theme,
      ),
    ).toBe('opacity 150ms cubic-bezier(0.4, 0, 0.2, 1)');
  });

  it('joins an array of transitions with `, `', () => {
    expect(
      resolveTransition(
        [
          { property: 'opacity', duration: '200ms' },
          { property: 'transform', duration: '300ms', easing: 'linear' },
        ],
        undefined,
      ),
    ).toBe('opacity 200ms ease, transform 300ms linear');
  });

  it('defaults property to "all" when omitted', () => {
    expect(resolveTransition({ duration: '200ms' }, undefined)).toBe('all 200ms ease');
  });
});

describe('resolveTransitionToVars (CSS-var mode)', () => {
  it('passes through raw CSS string', () => {
    expect(resolveTransitionToVars('opacity 200ms ease')).toBe('opacity 200ms ease');
  });

  it('emits var(--durations-3) for $durations.3', () => {
    expect(resolveTransitionToVars({ property: 'opacity', duration: '$durations.3' })).toBe(
      'opacity var(--durations-3) ease',
    );
  });

  it('emits var(--easings-standard) for $easings.standard', () => {
    expect(
      resolveTransitionToVars({
        property: 'opacity',
        duration: '$durations.2',
        easing: '$easings.standard',
      }),
    ).toBe('opacity var(--durations-2) var(--easings-standard)');
  });

  it('handles arrays consistently', () => {
    expect(
      resolveTransitionToVars([
        { property: 'opacity', duration: '$durations.3' },
        { property: 'transform', duration: '300ms' },
      ]),
    ).toBe('opacity var(--durations-3) ease, transform 300ms ease');
  });
});
