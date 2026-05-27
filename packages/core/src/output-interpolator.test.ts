import { describe, expect, it } from 'vitest';
import { classifyOutputRange, interpolateOutputs } from './output-interpolator.js';

describe('classifyOutputRange', () => {
  it('returns `numeric` for all-number outputs', () => {
    expect(classifyOutputRange([0, 1])).toBe('numeric');
    expect(classifyOutputRange([10, 20, 30])).toBe('numeric');
  });

  it('returns `color` for hex outputs', () => {
    expect(classifyOutputRange(['#fff', '#000'])).toBe('color');
    expect(classifyOutputRange(['#ffffff', '#000000'])).toBe('color');
    expect(classifyOutputRange(['#ff0000', '#00ff00', '#0000ff'])).toBe('color');
  });

  it('returns `color` for rgb / rgba outputs', () => {
    expect(classifyOutputRange(['rgb(255, 0, 0)', 'rgb(0, 0, 255)'])).toBe('color');
    expect(classifyOutputRange(['rgba(255, 0, 0, 0.5)', 'rgba(0, 0, 255, 1)'])).toBe('color');
  });

  it('returns `color` when mixing hex + rgb (both parse as colors)', () => {
    expect(classifyOutputRange(['#ff0000', 'rgb(0, 0, 255)'])).toBe('color');
  });

  it('returns `unit-matched` when all outputs share a length unit', () => {
    expect(classifyOutputRange(['8px', '16px'])).toBe('unit-matched');
    expect(classifyOutputRange(['1rem', '2rem'])).toBe('unit-matched');
    expect(classifyOutputRange(['25%', '75%'])).toBe('unit-matched');
    expect(classifyOutputRange(['10vh', '90vh', '50vh'])).toBe('unit-matched');
  });

  it('returns `step` for mixed units', () => {
    expect(classifyOutputRange(['8px', '1rem'])).toBe('step');
    expect(classifyOutputRange(['100%', '50px'])).toBe('step');
  });

  it('returns `step` for non-color, non-unit strings', () => {
    expect(classifyOutputRange(['hidden', 'visible'])).toBe('step');
    expect(classifyOutputRange(['flex', 'block'])).toBe('step');
  });

  it('returns `step` for mixed colour + unit (no uniform path)', () => {
    expect(classifyOutputRange(['#fff', '8px'])).toBe('step');
  });

  it('returns `step` for empty range', () => {
    expect(classifyOutputRange([])).toBe('step');
  });
});

describe('interpolateOutputs — numeric', () => {
  it('lerps linearly between two numbers', () => {
    expect(interpolateOutputs('numeric', 0, 100, 0)).toBe(0);
    expect(interpolateOutputs('numeric', 0, 100, 0.5)).toBe(50);
    expect(interpolateOutputs('numeric', 0, 100, 1)).toBe(100);
  });
});

describe('interpolateOutputs — color', () => {
  it('interpolates between two hex colors in sRGB', () => {
    // red → blue at t=0.5 = (128, 0, 128) = mid-purple
    expect(interpolateOutputs('color', '#ff0000', '#0000ff', 0.5)).toBe('rgb(128, 0, 128)');
  });

  it('preserves the start color at t=0 (as rgb form)', () => {
    expect(interpolateOutputs('color', '#ff0000', '#0000ff', 0)).toBe('rgb(255, 0, 0)');
  });

  it('preserves the end color at t=1', () => {
    expect(interpolateOutputs('color', '#ff0000', '#0000ff', 1)).toBe('rgb(0, 0, 255)');
  });

  it('expands 3-digit hex shorthand', () => {
    // #f00 → #00f at 0.5 = mid-purple (same as the 6-digit form above)
    expect(interpolateOutputs('color', '#f00', '#00f', 0.5)).toBe('rgb(128, 0, 128)');
  });

  it('interpolates alpha, promoting to rgba when partially transparent', () => {
    expect(interpolateOutputs('color', 'rgba(255, 0, 0, 0)', 'rgba(255, 0, 0, 1)', 0.5)).toBe(
      'rgba(255, 0, 0, 0.5)',
    );
  });

  it('emits rgb (no alpha channel) when both inputs are fully opaque', () => {
    expect(interpolateOutputs('color', 'rgb(0, 0, 0)', 'rgb(255, 255, 255)', 0.5)).toBe(
      'rgb(128, 128, 128)',
    );
  });

  it('parses 8-digit hex with alpha', () => {
    // #ff000080 = red at 50% alpha
    expect(interpolateOutputs('color', '#ff000080', '#0000ffff', 0.5)).toBe(
      'rgba(128, 0, 128, 0.751)',
    );
  });

  it('falls back to outputLow on malformed inputs', () => {
    // Defence-in-depth path — classifier would have filtered these.
    expect(interpolateOutputs('color', 'not-a-color', '#000', 0.5)).toBe('not-a-color');
  });
});

describe('interpolateOutputs — unit-matched', () => {
  it('lerps numeric part, preserves unit', () => {
    expect(interpolateOutputs('unit-matched', '8px', '16px', 0.5)).toBe('12px');
    expect(interpolateOutputs('unit-matched', '0px', '100px', 0.25)).toBe('25px');
    expect(interpolateOutputs('unit-matched', '1rem', '3rem', 0.5)).toBe('2rem');
    expect(interpolateOutputs('unit-matched', '25%', '75%', 0.5)).toBe('50%');
  });

  it('handles negative and fractional values', () => {
    expect(interpolateOutputs('unit-matched', '-10px', '10px', 0.5)).toBe('0px');
    expect(interpolateOutputs('unit-matched', '0.5rem', '1.5rem', 0.5)).toBe('1rem');
  });
});

describe('interpolateOutputs — step', () => {
  it('returns the segment start value', () => {
    expect(interpolateOutputs('step', 'hidden', 'visible', 0.4)).toBe('hidden');
    expect(interpolateOutputs('step', 'flex', 'block', 0.99)).toBe('flex');
  });
});
