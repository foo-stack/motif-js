/** @vitest-environment jsdom */
import type { ElementType } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  _resetDevWarningsForTesting,
  warnIfFlexPropsWithoutFlexDisplay,
  warnIfFocusOnNonTabbable,
} from './_dev-warnings.js';

describe('warnIfFocusOnNonTabbable', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    _resetDevWarningsForTesting();
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  it('warns when focus is set on a default <div>', () => {
    warnIfFocusOnNonTabbable(undefined, {});
    expect(warnSpy).toHaveBeenCalledOnce();
    const msg = warnSpy.mock.calls[0]![0] as string;
    expect(msg).toContain('_focus is set on a <div>');
    expect(msg).toContain('tabIndex');
  });

  it('warns when focus is set on a non-tabbable element type', () => {
    warnIfFocusOnNonTabbable('span', {});
    expect(warnSpy).toHaveBeenCalledOnce();
    expect(warnSpy.mock.calls[0]![0]).toContain('<span>');
  });

  it('does not warn for natively tabbable element types', () => {
    const tags: readonly ElementType[] = ['a', 'button', 'input', 'select', 'textarea', 'summary'];
    for (const tag of tags) {
      _resetDevWarningsForTesting();
      warnSpy.mockClear();
      warnIfFocusOnNonTabbable(tag, {});
      expect(warnSpy, `expected no warning for <${String(tag)}>`).not.toHaveBeenCalled();
    }
  });

  it('does not warn when tabIndex is set', () => {
    warnIfFocusOnNonTabbable(undefined, { tabIndex: 0 });
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('does not warn when tabIndex is negative', () => {
    warnIfFocusOnNonTabbable('div', { tabIndex: -1 });
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('skips the warning for non-string element types', () => {
    const Custom = (() => null) as unknown as React.ElementType;
    warnIfFocusOnNonTabbable(Custom, {});
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('warns at most once per element type', () => {
    warnIfFocusOnNonTabbable('div', {});
    warnIfFocusOnNonTabbable('div', {});
    warnIfFocusOnNonTabbable('div', {});
    expect(warnSpy).toHaveBeenCalledOnce();
  });

  it('warns once per distinct element type', () => {
    warnIfFocusOnNonTabbable('div', {});
    warnIfFocusOnNonTabbable('span', {});
    expect(warnSpy).toHaveBeenCalledTimes(2);
  });
});

describe('warnIfFlexPropsWithoutFlexDisplay', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    _resetDevWarningsForTesting();
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  it('warns when flexDirection is set on a default <div> with no display', () => {
    warnIfFlexPropsWithoutFlexDisplay(undefined, { flexDirection: 'row' });
    expect(warnSpy).toHaveBeenCalledOnce();
    const msg = warnSpy.mock.calls[0]![0] as string;
    expect(msg).toContain('flexDirection');
    expect(msg).toContain('<div>');
    expect(msg).toContain('display: block');
    expect(msg).toContain('Stack');
  });

  it('warns when alignItems is set without display', () => {
    warnIfFlexPropsWithoutFlexDisplay('div', { alignItems: 'center' });
    expect(warnSpy).toHaveBeenCalledOnce();
    expect(warnSpy.mock.calls[0]![0]).toContain('alignItems');
  });

  it('warns when gap-family is set without flex/grid display', () => {
    warnIfFlexPropsWithoutFlexDisplay('div', { gap: 8 });
    expect(warnSpy).toHaveBeenCalledOnce();
  });

  it('does not warn when display is "flex"', () => {
    warnIfFlexPropsWithoutFlexDisplay('div', { flexDirection: 'row', display: 'flex' });
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('does not warn when display is "inline-flex" / "grid" / "inline-grid"', () => {
    const variants = ['inline-flex', 'grid', 'inline-grid'];
    for (const display of variants) {
      _resetDevWarningsForTesting();
      warnSpy.mockClear();
      warnIfFlexPropsWithoutFlexDisplay('div', { flexDirection: 'row', display });
      expect(warnSpy, `expected no warning for display=${display}`).not.toHaveBeenCalled();
    }
  });

  it('does not warn when responsive display has flex at any breakpoint', () => {
    warnIfFlexPropsWithoutFlexDisplay('div', {
      flexDirection: 'row',
      display: { base: 'block', md: 'flex' },
    });
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('does not warn when responsive display array has flex anywhere', () => {
    warnIfFlexPropsWithoutFlexDisplay('div', {
      flexDirection: 'row',
      display: ['block', 'flex'],
    });
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('warns when responsive display object has no flex/grid slot', () => {
    warnIfFlexPropsWithoutFlexDisplay('div', {
      flexDirection: 'row',
      display: { base: 'block', md: 'block' },
    });
    expect(warnSpy).toHaveBeenCalledOnce();
  });

  it('does not warn when no flex/grid-only props are set', () => {
    warnIfFlexPropsWithoutFlexDisplay('div', { color: 'red', padding: 8 });
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('skips the warning for non-string element types', () => {
    const Custom = (() => null) as unknown as ElementType;
    warnIfFlexPropsWithoutFlexDisplay(Custom, { flexDirection: 'row' });
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('dedups by (resolved tag + sorted triggering props)', () => {
    warnIfFlexPropsWithoutFlexDisplay('div', { flexDirection: 'row' });
    warnIfFlexPropsWithoutFlexDisplay('div', { flexDirection: 'row' });
    warnIfFlexPropsWithoutFlexDisplay('div', { flexDirection: 'row' });
    expect(warnSpy).toHaveBeenCalledOnce();
  });

  it('warns once per distinct (tag, prop-set) combination', () => {
    // Same tag, different prop set
    warnIfFlexPropsWithoutFlexDisplay('div', { flexDirection: 'row' });
    warnIfFlexPropsWithoutFlexDisplay('div', { alignItems: 'center' });
    // Same tag, prop sets that sort identically
    warnIfFlexPropsWithoutFlexDisplay('div', { gap: 8, alignItems: 'start' });
    warnIfFlexPropsWithoutFlexDisplay('div', { alignItems: 'end', gap: 16 });
    // Different tag
    warnIfFlexPropsWithoutFlexDisplay('span', { flexDirection: 'row' });
    expect(warnSpy).toHaveBeenCalledTimes(4);
  });

  it('summarises multiple triggering props in the message', () => {
    warnIfFlexPropsWithoutFlexDisplay('div', {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    });
    const msg = warnSpy.mock.calls[0]![0] as string;
    expect(msg).toContain('and 2 other flex/grid-only props');
  });
});
