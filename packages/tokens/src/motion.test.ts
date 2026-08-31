import { describe, expect, it } from 'vitest';
import { resolveValue, type Theme } from '@usemotif/core';
import { durations, easings } from './primitives.js';

describe('motion tokens - durations', () => {
  it('exposes a numeric ladder of CSS time strings', () => {
    expect(durations[0]).toBe('0ms');
    expect(durations[3]).toBe('200ms');
    expect(durations[7]).toBe('1000ms');
  });

  it('resolves $durations.<n> through a theme', () => {
    const theme: Theme = {
      name: 'test',
      tokens: { durations: { ...durations } },
    };
    expect(resolveValue('$durations.3', theme)).toBe('200ms');
    expect(resolveValue('$durations.0', theme)).toBe('0ms');
    expect(resolveValue('$durations.7', theme)).toBe('1000ms');
  });
});

describe('motion tokens - easings', () => {
  it('exposes Material-style curves and CSS keyword shorthands', () => {
    expect(easings.standard).toBe('cubic-bezier(0.4, 0, 0.2, 1)');
    expect(easings.decelerate).toBe('cubic-bezier(0, 0, 0.2, 1)');
    expect(easings.accelerate).toBe('cubic-bezier(0.4, 0, 1, 1)');
    expect(easings.linear).toBe('linear');
    expect(easings.inOut).toBe('ease-in-out');
  });

  it('resolves $easings.<name> through a theme', () => {
    const theme: Theme = {
      name: 'test',
      tokens: { easings: { ...easings } },
    };
    expect(resolveValue('$easings.standard', theme)).toBe('cubic-bezier(0.4, 0, 0.2, 1)');
    expect(resolveValue('$easings.linear', theme)).toBe('linear');
  });
});
