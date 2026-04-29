/** @vitest-environment jsdom */
import type { ElementType } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { _resetDevWarningsForTesting, warnIfFocusOnNonTabbable } from './_dev-warnings.js';

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
