/** @vitest-environment jsdom */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import type { Theme } from '@usemotif/core';
import { Box } from './Box.js';
import { ThemeProvider } from './Theme.js';

const theme: Theme = {
  name: 'test',
  tokens: {},
};

let container: HTMLElement;
let root: Root;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

/**
 * The RN mock turns `Box drag` into a `<div data-motif-host="View">`
 * receiving the PanResponder panHandlers. The mock's `PanResponder.create`
 * returns `{ panHandlers: config }`, so the host element gets every
 * onPanResponder* prop as a regular HTML attribute via the spread.
 */

describe('native Box — drag prop', () => {
  it('forwards PanResponder handlers when drag is set', () => {
    act(() => {
      root.render(
        <ThemeProvider themes={[theme]} active="test">
          <Box drag testID="target">
            drag
          </Box>
        </ThemeProvider>,
      );
    });
    const el = container.querySelector('[data-motif-host="Animated.View"]') as HTMLElement;
    expect(el).not.toBeNull();
  });

  it('renders without throwing when drag callbacks are provided', () => {
    const onDragStart = vi.fn();
    const onDragEnd = vi.fn();
    expect(() => {
      act(() => {
        root.render(
          <ThemeProvider themes={[theme]} active="test">
            <Box drag onDragStart={onDragStart} onDragEnd={onDragEnd} testID="t">
              drag
            </Box>
          </ThemeProvider>,
        );
      });
    }).not.toThrow();
    const el = container.querySelector('[data-motif-host="Animated.View"]') as HTMLElement;
    expect(el).not.toBeNull();
  });

  it('accepts dragConstraints / dragElastic / dragMomentum without throwing', () => {
    expect(() => {
      act(() => {
        root.render(
          <ThemeProvider themes={[theme]} active="test">
            <Box
              drag
              dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
              dragElastic={0.4}
              dragMomentum
            >
              drag
            </Box>
          </ThemeProvider>,
        );
      });
    }).not.toThrow();
  });
});
