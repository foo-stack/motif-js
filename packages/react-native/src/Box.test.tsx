import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createRoot, type Root } from 'react-dom/client';
import { act } from 'react';
import type { Theme } from '@usemotif/core';
import { Box } from './Box.js';
import { Theme as ThemeBoundary, ThemeProvider } from './Theme.js';

const testTheme: Theme = {
  name: 'test',
  tokens: {
    colors: {
      blue: { 500: '#3b82f6' },
      surface: { base: '#ffffff', muted: '#f0f0f0' },
    },
    space: { 1: 4, 2: 8, 4: 16, 6: 24, 8: 32 },
    radii: { md: 8 },
    sizes: { full: '100%' },
  },
};

const darkTheme: Theme = {
  name: 'dark',
  tokens: {
    colors: {
      surface: { base: '#000000' },
    },
  },
};

let container: HTMLElement;
let root: Root;

function render(node: React.ReactNode): void {
  act(() => {
    root.render(node);
  });
}

/** Read the resolved style array (JSON-encoded on `data-motif-style`)
 * off the first View-host element under `el`, flatten and return. */
function viewStyle(el: HTMLElement): Record<string, unknown> {
  const view = el.querySelector('[data-motif-host="View"]');
  if (view === null) throw new Error('No View host found');
  const raw = view.getAttribute('data-motif-style');
  if (raw === null) return {};
  const parsed = JSON.parse(raw) as unknown;
  return flatten(parsed);
}

function flatten(s: unknown): Record<string, unknown> {
  if (s === null || s === undefined) return {};
  if (Array.isArray(s)) {
    return s.reduce<Record<string, unknown>>((acc, x) => Object.assign(acc, flatten(x)), {});
  }
  return s as Record<string, unknown>;
}

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => {
    root.unmount();
  });
  document.body.removeChild(container);
});

describe('Native Box — literal styles', () => {
  it('renders an RN View with the resolved style', () => {
    render(
      <ThemeProvider themes={[testTheme]} active="test">
        <Box padding={16} backgroundColor="#ff0000" />
      </ThemeProvider>,
    );
    const style = viewStyle(container);
    expect(style.padding).toBe(16);
    expect(style.backgroundColor).toBe('#ff0000');
  });

  it('expands shorthand props (px → paddingInline, my → T+B)', () => {
    render(
      <ThemeProvider themes={[testTheme]} active="test">
        <Box px={16} my={8} />
      </ThemeProvider>,
    );
    const style = viewStyle(container);
    expect(style.paddingInline).toBe(16);
    expect(style.marginTop).toBe(8);
    expect(style.marginBottom).toBe(8);
  });
});

describe('Native Box — token resolution', () => {
  it('resolves $space.4 to the literal 16 from the active theme', () => {
    render(
      <ThemeProvider themes={[testTheme]} active="test">
        <Box p="$4" />
      </ThemeProvider>,
    );
    expect(viewStyle(container).padding).toBe(16);
  });

  it('resolves nested semantic refs (surface.base → literal hex)', () => {
    render(
      <ThemeProvider themes={[testTheme]} active="test">
        <Box bg="$colors.surface.base" />
      </ThemeProvider>,
    );
    expect(viewStyle(container).backgroundColor).toBe('#ffffff');
  });

  it('resolves $blue.500 via the colors default scale', () => {
    render(
      <ThemeProvider themes={[testTheme]} active="test">
        <Box bg="$blue.500" />
      </ThemeProvider>,
    );
    expect(viewStyle(container).backgroundColor).toBe('#3b82f6');
  });
});

describe('Native Box — responsive shapes (base slot only, for now)', () => {
  it('honors the base slot of a responsive object', () => {
    render(
      <ThemeProvider themes={[testTheme]} active="test">
        <Box p={{ base: '$2', md: '$8' }} />
      </ThemeProvider>,
    );
    // base = $space.2 → 8. The md slot is dropped on native until
    // viewport-driven resolution lands.
    expect(viewStyle(container).padding).toBe(8);
  });

  it('honors slot 0 of a responsive array', () => {
    render(
      <ThemeProvider themes={[testTheme]} active="test">
        <Box p={['$1', '$4']} />
      </ThemeProvider>,
    );
    expect(viewStyle(container).padding).toBe(4);
  });

  it('honors the base: slot of a responsive DSL string', () => {
    render(
      <ThemeProvider themes={[testTheme]} active="test">
        <Box p="base:$2 md:$8" />
      </ThemeProvider>,
    );
    expect(viewStyle(container).padding).toBe(8);
  });
});

describe('Native Box — pass-through props', () => {
  it('forwards non-style props (testID) to the View', () => {
    render(
      <ThemeProvider themes={[testTheme]} active="test">
        <Box testID="hello" p="$4" />
      </ThemeProvider>,
    );
    const view = container.querySelector('[data-motif-host="View"]');
    expect(view?.getAttribute('testID')).toBe('hello');
  });

  it('renders children inside the View', () => {
    render(
      <ThemeProvider themes={[testTheme]} active="test">
        <Box testID="outer">
          <Box testID="inner" />
        </Box>
      </ThemeProvider>,
    );
    const inner = container.querySelector('[data-motif-host="View"][testID="inner"]');
    expect(inner).not.toBeNull();
  });

  it('accepts pseudo-state props without crashing and discards them', () => {
    render(
      <ThemeProvider themes={[testTheme]} active="test">
        <Box
          testID="pseudo"
          p="$4"
          _hover={{ opacity: 0.9 }}
          _focus={{ borderWidth: 2 }}
          _active={{ opacity: 0.8 }}
          _disabled={{ opacity: 0.5 }}
        />
      </ThemeProvider>,
    );
    const view = container.querySelector('[data-motif-host="View"][testID="pseudo"]')!;
    // Pseudo bags must not be reflected in the resolved style — RN
    // <View> has no hovered/focused/pressed state.
    const raw = view.getAttribute('data-motif-style');
    const parsed = raw === null ? {} : (JSON.parse(raw) as unknown);
    const style = flatten(parsed);
    expect(style.opacity).toBeUndefined();
    expect(style.borderWidth).toBeUndefined();
    expect(style.padding).toBe(16);
    // And they must not leak through to View attributes.
    expect(view.getAttribute('_hover')).toBeNull();
    expect(view.getAttribute('_focus')).toBeNull();
  });
});

describe('Native ThemeProvider — switching active theme', () => {
  it('re-resolves token refs when active theme changes', () => {
    render(
      <ThemeProvider themes={[testTheme, darkTheme]} active="test">
        <Box bg="$colors.surface.base" />
      </ThemeProvider>,
    );
    expect(viewStyle(container).backgroundColor).toBe('#ffffff');

    act(() => {
      root.render(
        <ThemeProvider themes={[testTheme, darkTheme]} active="dark">
          <Box bg="$colors.surface.base" />
        </ThemeProvider>,
      );
    });
    expect(viewStyle(container).backgroundColor).toBe('#000000');
  });

  it('nested <Theme name> rebinds the active theme for descendants', () => {
    render(
      <ThemeProvider themes={[testTheme, darkTheme]} active="test">
        <Box testID="outer" bg="$colors.surface.base" />
        <ThemeBoundary name="dark">
          <Box testID="inner" bg="$colors.surface.base" />
        </ThemeBoundary>
      </ThemeProvider>,
    );
    const outer = container.querySelector('[data-motif-host="View"][testID="outer"]')!;
    const inner = container.querySelector('[data-motif-host="View"][testID="inner"]')!;
    expect(
      flatten(JSON.parse(outer.getAttribute('data-motif-style') ?? '{}')).backgroundColor,
    ).toBe('#ffffff');
    expect(
      flatten(JSON.parse(inner.getAttribute('data-motif-style') ?? '{}')).backgroundColor,
    ).toBe('#000000');
  });
});

describe('Native Box — layout animation host', () => {
  // Regression: `<Box layout>` feeds the FLIP hook's Animated.Value
  // transforms into the style, but Box rendered a plain View — where
  // Animated.Values never update (and useNativeDriver:true throws). The
  // layout path must render through Animated.View.
  it('renders <Box layout> through Animated.View, not a plain View', () => {
    render(
      <ThemeProvider themes={[testTheme]} active="test">
        <Box layout>hi</Box>
      </ThemeProvider>,
    );
    expect(container.querySelector('[data-motif-host="Animated.View"]')).not.toBeNull();
    // And it is NOT the plain-View host.
    const host = container.querySelector('[data-motif-host]')!;
    expect(host.getAttribute('data-motif-host')).toBe('Animated.View');
  });

  it('a plain <Box> (no layout) still renders through View', () => {
    render(
      <ThemeProvider themes={[testTheme]} active="test">
        <Box>hi</Box>
      </ThemeProvider>,
    );
    const host = container.querySelector('[data-motif-host]')!;
    expect(host.getAttribute('data-motif-host')).toBe('View');
  });
});
