import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createRoot, type Root } from 'react-dom/client';
import { act } from 'react';
import type { BreakpointName, MediaState } from '@usemotif/core';
import { __setDimensions } from './__test-setup__/react-native-mock.js';
import { useBreakpoint, useMedia } from './use-media.js';

let container: HTMLElement;
let root: Root;

let capturedMedia: MediaState | null = null;
let capturedBp: BreakpointName | 'base' | null = null;
let renders = 0;

function MediaProbe(): null {
  renders++;
  capturedMedia = useMedia();
  return null;
}

function BreakpointProbe(): null {
  capturedBp = useBreakpoint();
  return null;
}

beforeEach(() => {
  renders = 0;
  capturedMedia = null;
  capturedBp = null;
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  document.body.removeChild(container);
});

describe('useMedia (native)', () => {
  it('reports a min-width match map for a wide window', () => {
    __setDimensions(1280);
    act(() => root.render(<MediaProbe />));
    expect(capturedMedia).toMatchObject({ sm: true, md: true, lg: true, xl: true, '2xl': false });
  });

  it('reports all-false below the smallest breakpoint', () => {
    __setDimensions(375);
    act(() => root.render(<MediaProbe />));
    expect(capturedMedia).toMatchObject({ sm: false, md: false, lg: false });
  });

  it('re-renders on a breakpoint crossing, not on an in-band change', () => {
    __setDimensions(800); // md band [768, 1024)
    act(() => root.render(<MediaProbe />));
    const afterMount = renders;
    expect(capturedMedia?.md).toBe(true);

    act(() => __setDimensions(700)); // crosses below md → re-render
    const afterCross = renders;
    expect(afterCross).toBeGreaterThan(afterMount);
    expect(capturedMedia?.md).toBe(false);

    act(() => __setDimensions(650)); // still [640, 768) → no crossing → no re-render
    expect(renders).toBe(afterCross);

    act(() => __setDimensions(500)); // crosses below sm → re-render
    expect(renders).toBeGreaterThan(afterCross);
    expect(capturedMedia?.sm).toBe(false);
  });
});

describe('useBreakpoint (native)', () => {
  it('returns the largest matching breakpoint name', () => {
    __setDimensions(800);
    act(() => root.render(<BreakpointProbe />));
    expect(capturedBp).toBe('md');
  });

  it('returns "base" below the smallest breakpoint', () => {
    __setDimensions(400);
    act(() => root.render(<BreakpointProbe />));
    expect(capturedBp).toBe('base');
  });
});
