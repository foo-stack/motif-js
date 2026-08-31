import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createRoot, type Root } from 'react-dom/client';
import { act } from 'react';
import type { Theme } from '@usemotif/core';
import { __setDimensions, __setLayoutWidth } from './__test-setup__/react-native-mock.js';
import { Box } from './Box.js';
import { Container } from './Container.js';
import { ThemeProvider } from './Theme.js';

const theme: Theme = {
  name: 'test',
  tokens: { space: { 1: 4, 2: 8, 4: 16, 8: 32 } },
};

let container: HTMLElement;
let root: Root;

beforeEach(() => {
  __setDimensions(360); // narrow viewport so plain bp keys don't fire
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  document.body.removeChild(container);
});

function renderTree(node: React.ReactNode): void {
  act(() => root.render(node));
}

function styleOn(testID: string): Record<string, unknown> {
  const el = container.querySelector(`[data-motif-host="View"][testID="${testID}"]`);
  if (el === null) throw new Error(`No View testID="${testID}"`);
  const raw = el.getAttribute('data-motif-style');
  const parsed = JSON.parse(raw ?? '{}') as unknown;
  if (Array.isArray(parsed)) {
    return parsed.reduce<Record<string, unknown>>((acc, x) => Object.assign(acc, x ?? {}), {});
  }
  return parsed as Record<string, unknown>;
}

describe('Container - anonymous query (@<bp>)', () => {
  it('@md slot wins when nearest container width >= 768', () => {
    __setLayoutWidth('cont', 800);
    renderTree(
      <ThemeProvider themes={[theme]} active="test">
        <Container testID="cont">
          <Box testID="child" p={{ base: '$1', '@md': '$8' }} />
        </Container>
      </ThemeProvider>,
    );
    expect(styleOn('child').padding).toBe(32); // $space.8
  });

  it('@md slot does NOT win when container width < 768', () => {
    __setLayoutWidth('cont', 500);
    renderTree(
      <ThemeProvider themes={[theme]} active="test">
        <Container testID="cont">
          <Box testID="child" p={{ base: '$1', '@md': '$8' }} />
        </Container>
      </ThemeProvider>,
    );
    expect(styleOn('child').padding).toBe(4); // $space.1 (base)
  });

  it('viewport breakpoints still apply alongside container queries', () => {
    __setDimensions(900); // viewport >= md
    __setLayoutWidth('cont', 500); // container < md
    renderTree(
      <ThemeProvider themes={[theme]} active="test">
        <Container testID="cont">
          <Box testID="child" p={{ base: '$1', md: '$2' }} />
        </Container>
      </ThemeProvider>,
    );
    // Viewport md slot wins; @-keys absent, so no container override.
    expect(styleOn('child').padding).toBe(8); // $space.2
  });
});

describe('Container - named query (@<name>.<bp>)', () => {
  it('@card.md slot wins when card container width >= 768', () => {
    __setLayoutWidth('card', 800);
    renderTree(
      <ThemeProvider themes={[theme]} active="test">
        <Container name="card" testID="card">
          <Box testID="child" p={{ base: '$1', '@card.md': '$8' }} />
        </Container>
      </ThemeProvider>,
    );
    expect(styleOn('child').padding).toBe(32);
  });

  it('different name does NOT trigger', () => {
    __setLayoutWidth('card', 800);
    renderTree(
      <ThemeProvider themes={[theme]} active="test">
        <Container name="card" testID="card">
          <Box testID="child" p={{ base: '$1', '@aside.md': '$8' }} />
        </Container>
      </ThemeProvider>,
    );
    expect(styleOn('child').padding).toBe(4); // base wins; aside not in scope
  });

  it('outer named container width is visible to inner descendants', () => {
    __setLayoutWidth('outer', 800);
    __setLayoutWidth('inner', 200);
    renderTree(
      <ThemeProvider themes={[theme]} active="test">
        <Container name="outer" testID="outer">
          <Container name="inner" testID="inner">
            <Box testID="child" p={{ base: '$1', '@outer.md': '$8' }} />
          </Container>
        </Container>
      </ThemeProvider>,
    );
    // outer is in the named map (width=800 >= md=768), so the @outer.md
    // slot fires even though the immediate parent is `inner`.
    expect(styleOn('child').padding).toBe(32);
  });
});

describe('Container - cascade order (media → anon → named)', () => {
  it('named container overrides viewport when both qualify', () => {
    __setDimensions(900); // viewport >= md
    __setLayoutWidth('card', 1100); // card >= lg
    renderTree(
      <ThemeProvider themes={[theme]} active="test">
        <Container name="card" testID="card">
          <Box testID="child" p={{ base: '$1', md: '$2', '@card.lg': '$8' }} />
        </Container>
      </ThemeProvider>,
    );
    // viewport md → 8 first, then container @card.lg → 32 wins.
    expect(styleOn('child').padding).toBe(32);
  });

  it('falls through to viewport when container slot does not match', () => {
    __setDimensions(900); // viewport >= md
    __setLayoutWidth('card', 500); // card < md
    renderTree(
      <ThemeProvider themes={[theme]} active="test">
        <Container name="card" testID="card">
          <Box testID="child" p={{ base: '$1', md: '$2', '@card.md': '$8' }} />
        </Container>
      </ThemeProvider>,
    );
    // viewport md → 8 wins; @card.md doesn't apply (card < 768).
    expect(styleOn('child').padding).toBe(8);
  });
});

describe('Container - outside any container', () => {
  it('@-keys silently no-op when there is no enclosing Container', () => {
    renderTree(
      <ThemeProvider themes={[theme]} active="test">
        <Box testID="child" p={{ base: '$1', '@md': '$8' }} />
      </ThemeProvider>,
    );
    expect(styleOn('child').padding).toBe(4); // base wins; no container in scope
  });
});

describe('Container - rate-cap trailing flush', () => {
  // Regression: a width that arrived inside the rate-cap window was dropped
  // with no trailing update, so the container could keep a stale width (and
  // resolve descendant container queries wrong) indefinitely. The settled
  // width must flush when the window elapses.
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('applies a width that arrives within the cap window after the window elapses', () => {
    // Fresh element tree per render so React doesn't bail out via its
    // same-element-reference optimization (we need onLayout to re-fire).
    const freshTree = () => (
      <ThemeProvider themes={[theme]} active="test">
        <Container name="card" testID="card" rateCapMs={16}>
          <Box testID="child" p={{ base: '$1', '@card.md': '$8' }} />
        </Container>
      </ThemeProvider>
    );
    // Leading layout: narrow (below md) → @card.md must NOT win yet.
    __setLayoutWidth('card', 400);
    renderTree(freshTree());
    expect(styleOn('child').padding).toBe(4); // base wins; card is 400px

    // A wider width settles inside the cap window - re-render re-fires
    // onLayout, which the rate cap suppresses (Date is frozen by fake
    // timers, so no time has elapsed since the leading update).
    __setLayoutWidth('card', 900);
    renderTree(freshTree());
    // Still stale until the trailing flush runs.
    expect(styleOn('child').padding).toBe(4);

    // Advance past the cap window → trailing flush applies the 900px width.
    act(() => {
      vi.advanceTimersByTime(20);
    });
    expect(styleOn('child').padding).toBe(32); // @card.md slot now wins (900 >= 768)
  });
});
