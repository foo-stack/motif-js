import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createRoot, type Root } from 'react-dom/client';
import { act, type ReactNode } from 'react';
import type { Theme } from '@usemotif/core';
import { Box } from './Box.js';
import { ThemeProvider } from './Theme.js';
import { noopDriver } from './_animation/noop.js';
import { registerMotionDriver } from './_animation/index.js';

const testTheme: Theme = {
  name: 'test',
  tokens: {
    durations: { 3: '200ms' },
    easings: { standard: 'cubic-bezier(0.4, 0, 0.2, 1)' },
  },
};

let container: HTMLElement;
let root: Root;

function render(node: ReactNode): void {
  act(() => {
    root.render(node);
  });
}

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
  // Default to noop driver so tests are deterministic — no rAF, no
  // listener bookkeeping, just a single-frame entry.
  registerMotionDriver(noopDriver);
});

afterEach(() => {
  act(() => {
    root.unmount();
  });
  document.body.removeChild(container);
  registerMotionDriver(null);
});

describe('Native Box — enterStyle', () => {
  it('does not enter the motion path when enterStyle is omitted', () => {
    render(
      <ThemeProvider themes={[testTheme]} active="test">
        <Box opacity={1} />
      </ThemeProvider>,
    );
    // Plain path: only the base style applies.
    const style = viewStyle(container);
    expect(style.opacity).toBe(1);
  });

  it('settles to the base style after the entry animation completes', () => {
    render(
      <ThemeProvider themes={[testTheme]} active="test">
        <Box opacity={1} enterStyle={{ opacity: 0 }} />
      </ThemeProvider>,
    );
    // Noop driver returns from-style on first paint, then null after
    // the post-mount effect — by the time the test reads the style,
    // the effect has already run.
    const style = viewStyle(container);
    expect(style.opacity).toBe(1);
  });

  it('passes through HTML attributes when motion is active', () => {
    render(
      <ThemeProvider themes={[testTheme]} active="test">
        <Box testID="motion-box" enterStyle={{ opacity: 0 }} />
      </ThemeProvider>,
    );
    const view = container.querySelector('[data-motif-host="View"]') as HTMLElement;
    expect(view.getAttribute('testID')).toBe('motion-box');
  });

  it('honours user style overrides on top of the resolved base + overlay', () => {
    render(
      <ThemeProvider themes={[testTheme]} active="test">
        {/* style escape hatch wins last in the merge order. */}
        <Box opacity={1} style={{ borderRadius: 4 }} enterStyle={{ opacity: 0 }} />
      </ThemeProvider>,
    );
    const style = viewStyle(container);
    expect(style.opacity).toBe(1);
    expect(style.borderRadius).toBe(4);
  });
});

describe('Native Box — transition timing extraction', () => {
  it('parses a CSS-shorthand transition string', () => {
    render(
      <ThemeProvider themes={[testTheme]} active="test">
        <Box opacity={1} enterStyle={{ opacity: 0 }} transition="opacity 300ms ease-in" />
      </ThemeProvider>,
    );
    // No throw — the parser accepts CSS-shorthand. We can't easily
    // assert the parsed values from inside Box without exposing
    // them; instead, verify that the entry path resolves and the
    // base style is applied (settled via noop driver).
    const style = viewStyle(container);
    expect(style.opacity).toBe(1);
  });

  it('accepts an object form transition', () => {
    render(
      <ThemeProvider themes={[testTheme]} active="test">
        <Box
          opacity={1}
          enterStyle={{ opacity: 0 }}
          transition={{ property: 'opacity', duration: '$durations.3', easing: 'ease-out' }}
        />
      </ThemeProvider>,
    );
    const style = viewStyle(container);
    expect(style.opacity).toBe(1);
  });

  it('accepts an array of transition objects (uses the first for entry timing)', () => {
    render(
      <ThemeProvider themes={[testTheme]} active="test">
        <Box
          opacity={1}
          enterStyle={{ opacity: 0 }}
          transition={[
            { property: 'opacity', duration: '150ms' },
            { property: 'transform', duration: '300ms' },
          ]}
        />
      </ThemeProvider>,
    );
    const style = viewStyle(container);
    expect(style.opacity).toBe(1);
  });
});

describe('Native Box — exitStyle is accepted but no-ops in v1', () => {
  it('does not throw when exitStyle is provided', () => {
    expect(() => {
      render(
        <ThemeProvider themes={[testTheme]} active="test">
          <Box opacity={1} exitStyle={{ opacity: 0 }} />
        </ThemeProvider>,
      );
    }).not.toThrow();
  });

  it('does not enter the motion path on exitStyle alone', () => {
    render(
      <ThemeProvider themes={[testTheme]} active="test">
        <Box opacity={1} exitStyle={{ opacity: 0 }} />
      </ThemeProvider>,
    );
    // No enterStyle → plain path. Style should still resolve cleanly.
    const style = viewStyle(container);
    expect(style.opacity).toBe(1);
  });
});
