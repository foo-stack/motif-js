import { describe, expect, it } from 'vitest';
import {
  computeTargetScrollProgress,
  parseScrollOffset,
  parseScrollOffsetEdge,
} from './scroll-offset.js';

describe('parseScrollOffsetEdge', () => {
  it('maps keyword aliases to fractions', () => {
    expect(parseScrollOffsetEdge('start')).toBe(0);
    expect(parseScrollOffsetEdge('center')).toBe(0.5);
    expect(parseScrollOffsetEdge('end')).toBe(1);
  });

  it('parses percentage values', () => {
    expect(parseScrollOffsetEdge('0%')).toBe(0);
    expect(parseScrollOffsetEdge('25%')).toBe(0.25);
    expect(parseScrollOffsetEdge('100%')).toBe(1);
  });

  it('parses plain numeric inputs as fractions', () => {
    expect(parseScrollOffsetEdge(0.5)).toBe(0.5);
    expect(parseScrollOffsetEdge('0.25')).toBe(0.25);
  });

  it('throws on unrecognised tokens', () => {
    expect(() => parseScrollOffsetEdge('bogus')).toThrow();
  });
});

describe('parseScrollOffset', () => {
  it('parses framer-motion default offset', () => {
    const parsed = parseScrollOffset(['start end', 'end start']);
    expect(parsed[0]).toEqual({ elementFraction: 0, viewportFraction: 1 });
    expect(parsed[1]).toEqual({ elementFraction: 1, viewportFraction: 0 });
  });

  it('parses tuple form', () => {
    const parsed = parseScrollOffset([
      [0, 'end'],
      ['center', 0.25],
    ]);
    expect(parsed[0]).toEqual({ elementFraction: 0, viewportFraction: 1 });
    expect(parsed[1]).toEqual({ elementFraction: 0.5, viewportFraction: 0.25 });
  });
});

describe('computeTargetScrollProgress', () => {
  it('is 0 when the element has not entered the viewport range yet', () => {
    // element below viewport entirely
    const progress = computeTargetScrollProgress(
      2000, // elementStart (content-coords)
      300, //  elementSize
      0, //    viewportStart (scroll position)
      800, //  viewportSize
      [
        { elementFraction: 0, viewportFraction: 1 }, // start end
        { elementFraction: 1, viewportFraction: 0 }, // end start
      ],
    );
    expect(progress).toBe(0);
  });

  it('is 0 when the element top aligns with the viewport bottom (start of range)', () => {
    // element top = scroll + viewportHeight ⇒ progress = 0
    const elementStart = 800;
    const elementSize = 300;
    const scroll = 0;
    const vp = 800;
    expect(
      computeTargetScrollProgress(elementStart, elementSize, scroll, vp, [
        { elementFraction: 0, viewportFraction: 1 },
        { elementFraction: 1, viewportFraction: 0 },
      ]),
    ).toBe(0);
  });

  it('is 1 when the element bottom aligns with the viewport top (end of range)', () => {
    // anchor1 = 800 + 300*0 - 800*1 = 0  (scroll for progress 0)
    // anchor2 = 800 + 300*1 - 800*0 = 1100 (scroll for progress 1)
    const progress = computeTargetScrollProgress(800, 300, 1100, 800, [
      { elementFraction: 0, viewportFraction: 1 },
      { elementFraction: 1, viewportFraction: 0 },
    ]);
    expect(progress).toBe(1);
  });

  it('lerps linearly between the two anchors', () => {
    const progress = computeTargetScrollProgress(800, 300, 550, 800, [
      { elementFraction: 0, viewportFraction: 1 },
      { elementFraction: 1, viewportFraction: 0 },
    ]);
    expect(progress).toBeCloseTo(0.5, 6);
  });
});
