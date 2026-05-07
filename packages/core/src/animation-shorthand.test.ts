import { describe, expect, it } from 'vitest';
import { buildAnimationShorthand, extractKeyframeFromAnimation } from './motion.js';
import { makeKeyframe } from './keyframes.js';
import {
  PSEUDO_ELEMENT_PROP_NAMES,
  PSEUDO_ELEMENT_PROPS,
  PSEUDO_ELEMENT_SELECTOR,
  isPseudoElementProp,
} from './style-props.js';

describe('buildAnimationShorthand', () => {
  it('emits name + duration + easing with defaults when minimal', () => {
    expect(buildAnimationShorthand({ name: 'spin' })).toBe('spin 200ms ease');
  });

  it('passes through explicit duration + easing', () => {
    expect(buildAnimationShorthand({ name: 'spin', duration: '1s', easing: 'linear' })).toBe(
      'spin 1s linear',
    );
  });

  it('resolves $durations / $easings token refs to var()', () => {
    expect(
      buildAnimationShorthand({
        name: 'spin',
        duration: '$durations.ui',
        easing: '$easings.base',
      }),
    ).toBe('spin var(--durations-ui) var(--easings-base)');
  });

  it('appends optional slots in spec order', () => {
    expect(
      buildAnimationShorthand({
        name: 'spin',
        duration: '1s',
        easing: 'linear',
        delay: '100ms',
        iterationCount: 'infinite',
        direction: 'alternate',
        fillMode: 'forwards',
        playState: 'running',
      }),
    ).toBe('spin 1s linear 100ms infinite alternate forwards running');
  });

  it('omits empty slots', () => {
    expect(
      buildAnimationShorthand({
        name: 'spin',
        duration: '1s',
        easing: 'linear',
        iterationCount: 3,
      }),
    ).toBe('spin 1s linear 3');
  });

  it('uses the Keyframe name when name is a Keyframe', () => {
    const spin = makeKeyframe({ '0%': { opacity: 0 }, '100%': { opacity: 1 } });
    const shorthand = buildAnimationShorthand({
      name: spin,
      duration: '1s',
      easing: 'linear',
      iterationCount: 'infinite',
    });
    expect(shorthand).toBe(`${spin.name} 1s linear infinite`);
  });
});

describe('extractKeyframeFromAnimation', () => {
  it('returns the Keyframe for an object form referencing one', () => {
    const spin = makeKeyframe({ '0%': { opacity: 0 } });
    expect(extractKeyframeFromAnimation({ name: spin, duration: '1s' })).toBe(spin);
  });

  it('returns undefined for string form', () => {
    expect(extractKeyframeFromAnimation('quick')).toBeUndefined();
  });

  it('returns undefined for object form with string name', () => {
    expect(extractKeyframeFromAnimation({ name: 'spin', duration: '1s' })).toBeUndefined();
  });

  it('returns undefined for undefined input', () => {
    expect(extractKeyframeFromAnimation(undefined)).toBeUndefined();
  });
});

describe('pseudo-element prop schema', () => {
  it('exposes the prop names', () => {
    expect(PSEUDO_ELEMENT_PROP_NAMES).toEqual(['_before', '_after']);
  });

  it('isPseudoElementProp accepts the recognized names', () => {
    expect(isPseudoElementProp('_before')).toBe(true);
    expect(isPseudoElementProp('_after')).toBe(true);
    expect(isPseudoElementProp('_hover')).toBe(false);
    expect(isPseudoElementProp('p')).toBe(false);
    expect(PSEUDO_ELEMENT_PROPS.size).toBe(2);
  });

  it('selectors are double-colon (CSS3)', () => {
    expect(PSEUDO_ELEMENT_SELECTOR._before).toBe('::before');
    expect(PSEUDO_ELEMENT_SELECTOR._after).toBe('::after');
  });
});
