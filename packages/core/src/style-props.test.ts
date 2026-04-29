import { describe, expect, it } from 'vitest';
import {
  PSEUDO_SELECTOR,
  PSEUDO_STATE_PROP_NAMES,
  PSEUDO_STATE_PROPS,
  STYLE_PROP_NAMES,
  isPseudoStateProp,
  isStyleProp,
} from './style-props.js';

describe('style-props', () => {
  it('isStyleProp recognises known props', () => {
    expect(isStyleProp('p')).toBe(true);
    expect(isStyleProp('bg')).toBe(true);
    expect(isStyleProp('flexDirection')).toBe(true);
  });

  it('isStyleProp rejects unknown keys', () => {
    expect(isStyleProp('id')).toBe(false);
    expect(isStyleProp('_hover')).toBe(false);
    expect(isStyleProp('onClick')).toBe(false);
  });

  it('STYLE_PROP_NAMES contains every entry exactly once', () => {
    expect(STYLE_PROP_NAMES.size).toBeGreaterThan(40);
    expect(STYLE_PROP_NAMES.has('p')).toBe(true);
    expect(STYLE_PROP_NAMES.has('_hover')).toBe(false);
  });
});

describe('pseudo-state schema', () => {
  it('exposes the four prop names', () => {
    expect(PSEUDO_STATE_PROP_NAMES).toEqual(['_hover', '_focus', '_active', '_disabled']);
  });

  it('isPseudoStateProp recognises pseudo names and rejects others', () => {
    expect(isPseudoStateProp('_hover')).toBe(true);
    expect(isPseudoStateProp('_focus')).toBe(true);
    expect(isPseudoStateProp('_active')).toBe(true);
    expect(isPseudoStateProp('_disabled')).toBe(true);
    expect(isPseudoStateProp('p')).toBe(false);
    expect(isPseudoStateProp('hover')).toBe(false);
  });

  it('PSEUDO_STATE_PROPS membership matches the name list', () => {
    expect(PSEUDO_STATE_PROPS.size).toBe(4);
    for (const name of PSEUDO_STATE_PROP_NAMES) {
      expect(PSEUDO_STATE_PROPS.has(name)).toBe(true);
    }
  });

  it('maps _focus to :focus-visible (deliberate over :focus)', () => {
    expect(PSEUDO_SELECTOR._focus).toBe(':focus-visible');
  });

  it('maps _disabled to a selector that covers both :disabled and aria-disabled', () => {
    expect(PSEUDO_SELECTOR._disabled).toContain(':disabled');
    expect(PSEUDO_SELECTOR._disabled).toContain('aria-disabled');
  });

  it('maps _hover and _active to their plain CSS pseudo-classes', () => {
    expect(PSEUDO_SELECTOR._hover).toBe(':hover');
    expect(PSEUDO_SELECTOR._active).toBe(':active');
  });
});

describe('motion prop schema (membership)', () => {
  it('isStyleProp does not match motion prop names', async () => {
    const { isMotionProp } = await import('./style-props.js');
    expect(isMotionProp('enterStyle')).toBe(true);
    expect(isStyleProp('enterStyle')).toBe(false);
    expect(isPseudoStateProp('enterStyle')).toBe(false);
  });
});
