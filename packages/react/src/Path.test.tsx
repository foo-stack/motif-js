/** @vitest-environment jsdom */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { createMotionValue } from '@usemotif/core';
import { Path } from './Path.js';

let container: HTMLElement;
let root: Root;

function render(node: ReactNode): void {
  act(() => {
    root.render(node);
  });
}

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

function getPath(): SVGPathElement {
  const el = container.querySelector('path');
  if (el === null) throw new Error('no <path> rendered');
  return el;
}

describe('Path - pathLength', () => {
  it('renders a plain path without dash mechanics when pathLength is omitted', () => {
    render(
      <svg>
        <Path d="M0 0 L10 10" />
      </svg>,
    );
    const el = getPath();
    expect(el.hasAttribute('pathLength')).toBe(false);
    expect(el.hasAttribute('stroke-dasharray')).toBe(false);
    expect(el.hasAttribute('stroke-dashoffset')).toBe(false);
  });

  it('emits pathLength=1 and stroke-dashoffset = 1 - progress for a numeric value', () => {
    render(
      <svg>
        <Path d="M0 0 L10 10" pathLength={0.25} />
      </svg>,
    );
    const el = getPath();
    expect(el.getAttribute('pathLength')).toBe('1');
    expect(el.getAttribute('stroke-dasharray')).toBe('1 1');
    expect(el.getAttribute('stroke-dashoffset')).toBe('0.75');
  });

  it('reads the initial MotionValue snapshot', () => {
    const mv = createMotionValue(0.5);
    render(
      <svg>
        <Path d="M0 0 L10 10" pathLength={mv} />
      </svg>,
    );
    const el = getPath();
    expect(el.getAttribute('stroke-dashoffset')).toBe('0.5');
  });

  it('updates the dashoffset when the MotionValue changes', () => {
    const mv = createMotionValue(0);
    render(
      <svg>
        <Path d="M0 0 L10 10" pathLength={mv} />
      </svg>,
    );
    expect(getPath().getAttribute('stroke-dashoffset')).toBe('1');

    act(() => {
      mv.set(1);
    });
    expect(getPath().getAttribute('stroke-dashoffset')).toBe('0');

    act(() => {
      mv.set(0.6);
    });
    expect(parseFloat(getPath().getAttribute('stroke-dashoffset') ?? '')).toBeCloseTo(0.4, 5);
  });
});
