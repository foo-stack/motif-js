/** @vitest-environment jsdom */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { act, useEffect, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import type { Theme as ThemeType } from '@usemotif/core';
import { Theme, ThemeProvider } from './Theme.js';
import { useTheme, useThemeChain, useThemeName } from './theme-context.js';

const light: ThemeType = {
  name: 'light',
  tokens: { colors: { surface: { base: '#ffffff' } } },
};
const dark: ThemeType = {
  name: 'dark',
  tokens: { colors: { surface: { base: '#000000' } } },
};
const red: ThemeType = {
  name: 'red',
  tokens: { colors: { surface: { base: '#ff0000' } } },
};
const dark_red: ThemeType = {
  name: 'dark_red',
  tokens: { colors: { surface: { base: '#660000' } } },
};
const dark_red_blue: ThemeType = {
  name: 'dark_red_blue',
  tokens: { colors: { surface: { base: '#0033ff' } } },
};

let container: HTMLElement;
let root: Root;

function render(node: ReactNode): void {
  act(() => {
    root.render(node);
  });
}

/** Capture the values from the chain hooks for assertion. */
function makeProbe(): {
  result: {
    current: {
      name: string | undefined;
      chain: readonly string[] | undefined;
      theme: ThemeType | undefined;
    };
  };
  Probe: () => null;
} {
  const result: {
    current: {
      name: string | undefined;
      chain: readonly string[] | undefined;
      theme: ThemeType | undefined;
    };
  } = { current: { name: undefined, chain: undefined, theme: undefined } };
  function Probe(): null {
    const name = useThemeName();
    const chain = useThemeChain();
    const theme = useTheme();
    useEffect(() => {
      result.current = { name, chain, theme };
    });
    result.current = { name, chain, theme };
    return null;
  }
  return { result, Probe };
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

describe('chainable themes — provider only', () => {
  it('initialises chain with the active name', () => {
    const { result, Probe } = makeProbe();
    render(
      <ThemeProvider themes={[light, dark]} active="dark">
        <Probe />
      </ThemeProvider>,
    );
    expect(result.current.name).toBe('dark');
    expect(result.current.chain).toEqual(['dark']);
    expect(result.current.theme?.name).toBe('dark');
  });

  it('renders the data-theme attribute on the wrapper', () => {
    render(
      <ThemeProvider themes={[light, dark]} active="dark">
        <span>x</span>
      </ThemeProvider>,
    );
    const wrapper = container.querySelector('[data-theme]');
    expect(wrapper?.getAttribute('data-theme')).toBe('dark');
  });
});

describe('chainable themes — 2-deep, combo registered', () => {
  it('useThemeName returns the chained combo when registered', () => {
    const { result, Probe } = makeProbe();
    render(
      <ThemeProvider themes={[light, dark, red, dark_red]} active="dark">
        <Theme name="red">
          <Probe />
        </Theme>
      </ThemeProvider>,
    );
    expect(result.current.name).toBe('dark_red');
    expect(result.current.chain).toEqual(['dark', 'red']);
    expect(result.current.theme?.name).toBe('dark_red');
  });

  it('emits data-theme="dark_red" on the inner wrapper', () => {
    render(
      <ThemeProvider themes={[light, dark, red, dark_red]} active="dark">
        <Theme name="red">
          <span>x</span>
        </Theme>
      </ThemeProvider>,
    );
    const wrappers = container.querySelectorAll('[data-theme]');
    expect(wrappers.length).toBe(2);
    expect(wrappers[0]?.getAttribute('data-theme')).toBe('dark');
    expect(wrappers[1]?.getAttribute('data-theme')).toBe('dark_red');
  });
});

describe('chainable themes — combo NOT registered', () => {
  it('falls back to the inner name when registered standalone', () => {
    const { result, Probe } = makeProbe();
    render(
      <ThemeProvider themes={[light, dark, red]} active="dark">
        <Theme name="red">
          <Probe />
        </Theme>
      </ThemeProvider>,
    );
    expect(result.current.name).toBe('red');
    expect(result.current.chain).toEqual(['dark', 'red']);
  });

  it('falls back to the parent name when neither combo nor inner is registered', () => {
    const { result, Probe } = makeProbe();
    render(
      <ThemeProvider themes={[light, dark]} active="dark">
        <Theme name="purple">
          <Probe />
        </Theme>
      </ThemeProvider>,
    );
    // Neither `dark_purple` nor `purple` is registered → parent wins.
    expect(result.current.name).toBe('dark');
    expect(result.current.chain).toEqual(['dark', 'purple']);
  });
});

describe('chainable themes — 3-deep', () => {
  it('returns the longest matching prefix from the chain', () => {
    const { result, Probe } = makeProbe();
    render(
      <ThemeProvider themes={[light, dark, red, dark_red, dark_red_blue]} active="dark">
        <Theme name="red">
          <Theme name="blue">
            <Probe />
          </Theme>
        </Theme>
      </ThemeProvider>,
    );
    expect(result.current.name).toBe('dark_red_blue');
    expect(result.current.chain).toEqual(['dark', 'red', 'blue']);
  });

  it('falls back to the longest registered prefix when the deepest combo is unregistered', () => {
    const { result, Probe } = makeProbe();
    render(
      <ThemeProvider themes={[light, dark, red, dark_red]} active="dark">
        <Theme name="red">
          <Theme name="blue">
            <Probe />
          </Theme>
        </Theme>
      </ThemeProvider>,
    );
    // dark_red_blue not registered → drop to dark_red.
    expect(result.current.name).toBe('dark_red');
    expect(result.current.chain).toEqual(['dark', 'red', 'blue']);
  });
});

describe('chainable themes — sibling chains', () => {
  it('siblings resolve independently', () => {
    const { result: leftResult, Probe: LeftProbe } = makeProbe();
    const { result: rightResult, Probe: RightProbe } = makeProbe();
    render(
      <ThemeProvider themes={[light, dark, red, dark_red]} active="dark">
        <Theme name="red">
          <LeftProbe />
        </Theme>
        <RightProbe />
      </ThemeProvider>,
    );
    expect(leftResult.current.name).toBe('dark_red');
    expect(leftResult.current.chain).toEqual(['dark', 'red']);
    // Right probe sits at the provider level — no nested chain.
    expect(rightResult.current.name).toBe('dark');
    expect(rightResult.current.chain).toEqual(['dark']);
  });
});

describe('chainable themes — Theme without provider', () => {
  it('renders without crashing and reports a single-entry chain', () => {
    const { result, Probe } = makeProbe();
    render(
      <Theme name="dark">
        <Probe />
      </Theme>,
    );
    expect(result.current.chain).toEqual(['dark']);
    // No themes registered → active falls back to the inner name even
    // though the cascade has nothing to match it against.
    expect(result.current.name).toBe('dark');
  });
});
