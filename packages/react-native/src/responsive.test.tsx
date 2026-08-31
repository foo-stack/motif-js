import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createRoot, type Root } from 'react-dom/client';
import { act } from 'react';
import type { Theme } from '@usemotif/core';
import { __setDimensions } from './__test-setup__/react-native-mock.js';
import { Box } from './Box.js';
import { ThemeProvider } from './Theme.js';
import {
  resolveResponsiveAtWidth,
  resolveResponsivePropsAtViewportAndContainer,
} from './responsive.js';

const theme: Theme = {
  name: 'test',
  tokens: { space: { 1: 4, 2: 8, 4: 16, 6: 24, 8: 32 } },
};

describe('resolveResponsiveAtWidth - pure function', () => {
  it('honors base when width is below smallest breakpoint', () => {
    expect(resolveResponsiveAtWidth({ base: 'A', md: 'B' }, 360)).toBe('A');
  });

  it('honors largest breakpoint <= width (object form)', () => {
    expect(resolveResponsiveAtWidth({ base: 'A', sm: 'B', md: 'C', lg: 'D' }, 800)).toBe('C'); // 800 ≥ md=768, < lg=1024
    expect(resolveResponsiveAtWidth({ base: 'A', md: 'B' }, 1500)).toBe('B'); // md still wins
  });

  it('falls through gaps in the slot ladder', () => {
    // Slot order: base, sm, md, lg, xl, 2xl. md is undefined → falls
    // back to sm at md+ widths.
    expect(resolveResponsiveAtWidth({ base: 'A', sm: 'B', lg: 'D' }, 800)).toBe('B');
  });

  it('handles array form (positional)', () => {
    // [base, sm, md, lg]
    expect(resolveResponsiveAtWidth(['A', 'B', 'C', 'D'], 800)).toBe('C');
    expect(resolveResponsiveAtWidth(['A', 'B', 'C'], 360)).toBe('A');
  });

  it('handles DSL form', () => {
    expect(resolveResponsiveAtWidth('base:A md:C lg:D', 1100)).toBe('D'); // 1100 ≥ lg=1024
    expect(resolveResponsiveAtWidth('base:A md:C', 600)).toBe('A');
  });

  it('drops container-query keys (handled by Container polyfill)', () => {
    // Container-only object - base undefined, only @-keys. Returns
    // undefined; the caller drops the prop.
    expect(resolveResponsiveAtWidth({ '@card.md': 'X' }, 1500)).toBeUndefined();
  });

  it('non-responsive values pass through unchanged', () => {
    expect(resolveResponsiveAtWidth(42, 500)).toBe(42);
    expect(resolveResponsiveAtWidth('#fff', 500)).toBe('#fff');
    expect(resolveResponsiveAtWidth('rgb(0, 0, 0)', 500)).toBe('rgb(0, 0, 0)');
  });
});

describe('resolveResponsivePropsAtViewportAndContainer - per-tree widths (#286)', () => {
  const NO_CONTAINER = { nearestWidth: null, named: new Map<string, number>() };
  const CUSTOM = { sm: 640, md: 900, lg: 1024, xl: 1280, '2xl': 1536 };

  it('honors configured breakpoint widths instead of the frozen defaults', () => {
    const props = { p: { base: 4, md: 8 } };
    // Default md = 768: at 800px, md applies.
    expect(resolveResponsivePropsAtViewportAndContainer(props, 800, NO_CONTAINER).p).toBe(8);
    // Custom md = 900: at 800px, md must NOT apply - the declarative native path
    // now honors `<ThemeProvider breakpoints>` (previously frozen to defaults).
    expect(resolveResponsivePropsAtViewportAndContainer(props, 800, NO_CONTAINER, CUSTOM).p).toBe(
      4,
    );
    // ...and applies once the viewport reaches the custom width.
    expect(resolveResponsivePropsAtViewportAndContainer(props, 950, NO_CONTAINER, CUSTOM).p).toBe(
      8,
    );
  });
});

let container: HTMLElement;
let root: Root;

beforeEach(() => {
  __setDimensions(360); // mobile-portrait default
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  document.body.removeChild(container);
});

function viewStyle(): Record<string, unknown> {
  const v = container.querySelector('[data-motif-host="View"]')!;
  const raw = v.getAttribute('data-motif-style');
  const parsed = JSON.parse(raw ?? '{}') as unknown;
  if (Array.isArray(parsed)) {
    return parsed.reduce<Record<string, unknown>>((acc, x) => Object.assign(acc, x ?? {}), {});
  }
  return parsed as Record<string, unknown>;
}

describe('Box - viewport-driven resolution', () => {
  it('picks the base slot at narrow widths', () => {
    __setDimensions(360);
    act(() =>
      root.render(
        <ThemeProvider themes={[theme]} active="test">
          <Box p={{ base: '$2', md: '$8' }} />
        </ThemeProvider>,
      ),
    );
    expect(viewStyle().padding).toBe(8); // $space.2
  });

  it('picks the md slot at md-or-larger widths', () => {
    __setDimensions(900);
    act(() =>
      root.render(
        <ThemeProvider themes={[theme]} active="test">
          <Box p={{ base: '$2', md: '$8' }} />
        </ThemeProvider>,
      ),
    );
    expect(viewStyle().padding).toBe(32); // $space.8
  });

  it('picks the lg slot when width crosses lg breakpoint', () => {
    __setDimensions(1400);
    act(() =>
      root.render(
        <ThemeProvider themes={[theme]} active="test">
          <Box p={{ base: '$2', md: '$4', lg: '$6' }} />
        </ThemeProvider>,
      ),
    );
    expect(viewStyle().padding).toBe(24); // $space.6
  });

  it('handles array form (positional [base, sm, md])', () => {
    __setDimensions(700); // ≥ sm=640, < md=768
    act(() =>
      root.render(
        <ThemeProvider themes={[theme]} active="test">
          <Box p={['$1', '$4', '$8']} />
        </ThemeProvider>,
      ),
    );
    expect(viewStyle().padding).toBe(16); // $space.4 (sm slot)
  });

  it('handles DSL form', () => {
    __setDimensions(900);
    act(() =>
      root.render(
        <ThemeProvider themes={[theme]} active="test">
          <Box p="base:$2 md:$8" />
        </ThemeProvider>,
      ),
    );
    expect(viewStyle().padding).toBe(32);
  });

  it('re-resolves on Dimensions change (window resize on tablet / split-screen)', () => {
    __setDimensions(360);
    act(() =>
      root.render(
        <ThemeProvider themes={[theme]} active="test">
          <Box p={{ base: '$2', md: '$8' }} />
        </ThemeProvider>,
      ),
    );
    expect(viewStyle().padding).toBe(8);

    // Simulate split-screen / device rotation that puts us above md.
    act(() => __setDimensions(900));
    expect(viewStyle().padding).toBe(32);

    // And back down.
    act(() => __setDimensions(360));
    expect(viewStyle().padding).toBe(8);
  });

  it('drops container-query keys at the viewport stage', () => {
    __setDimensions(900);
    act(() =>
      root.render(
        <ThemeProvider themes={[theme]} active="test">
          <Box p={{ '@card.md': '$8' }} />
        </ThemeProvider>,
      ),
    );
    // Container-only prop → resolved to undefined → dropped from style.
    expect(viewStyle().padding).toBeUndefined();
  });
});
