import { afterEach, describe, expect, it } from 'vitest';
import { configureViewportBreakpoints, viewportBreakpointOverride } from './_breakpoint-config.js';

afterEach(() => configureViewportBreakpoints({})); // clear between cases

describe('configureViewportBreakpoints (#292)', () => {
  it('merges successive overrides instead of replacing them', () => {
    configureViewportBreakpoints({ sm: 600 });
    configureViewportBreakpoints({ lg: 1200 });
    // The earlier `sm` override must survive the second call.
    expect(viewportBreakpointOverride('sm')).toBe(600);
    expect(viewportBreakpointOverride('lg')).toBe(1200);
  });

  it('overwrites a key on a later call', () => {
    configureViewportBreakpoints({ md: 700 });
    configureViewportBreakpoints({ md: 800 });
    expect(viewportBreakpointOverride('md')).toBe(800);
  });

  it('clears all overrides when passed an empty object', () => {
    configureViewportBreakpoints({ sm: 600, lg: 1200 });
    configureViewportBreakpoints({});
    expect(viewportBreakpointOverride('sm')).toBeUndefined();
    expect(viewportBreakpointOverride('lg')).toBeUndefined();
  });
});
