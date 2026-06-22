/** @vitest-environment jsdom */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createRoot, type Root } from 'react-dom/client';
import { act } from 'react';
import { Box } from './Box.js';
import { _resetDevWarningsForTesting } from './_dev-warnings.js';
import { _resetStyleCacheForTesting } from './style-cache.js';

// Hoisted so each JSX prop isn't a fresh object per render (lint: no-unstable-props).
const EXIT_SLOW = { opacity: 0, transition: 'opacity 400ms ease-in' };
const EXIT_PLAIN = { opacity: 0 };
const EXIT_TOKEN = { opacity: 0, transition: { property: 'opacity', duration: '$durations.3' } };
const EXIT_OWN = { opacity: 0, transition: 'opacity 300ms' };

let container: HTMLElement;
let root: Root;

function render(node: React.ReactNode): HTMLElement {
  act(() => {
    root.render(node);
  });
  return container;
}

/** Concatenated text of every injected <style> block. */
function styleText(): string {
  return Array.from(document.head.querySelectorAll('style'))
    .map((s) => s.textContent ?? '')
    .join('\n');
}

beforeEach(() => {
  _resetStyleCacheForTesting();
  _resetDevWarningsForTesting();
  document.head.innerHTML = '';
  document.body.innerHTML = '';
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => {
    root.unmount();
  });
  document.body.removeChild(container);
  _resetStyleCacheForTesting();
  _resetDevWarningsForTesting();
  document.head.innerHTML = '';
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Box — asymmetric exit (transition inside exitStyle)', () => {
  it('emits the exit-phase transition into the [data-motif-state="exiting"] rule', () => {
    render(<Box exitStyle={EXIT_SLOW} transition="opacity 200ms ease" data-testid="x" />);
    const css = styleText();
    const exitRule = css
      .split('}')
      .map((r) => `${r}}`)
      .find((r) => r.includes('exiting'));
    expect(exitRule).toBeTruthy();
    expect(exitRule).toMatch(/opacity:\s*0/);
    expect(exitRule).toMatch(/transition:\s*opacity 400ms ease-in/);
  });

  it('lifts the base transition off inline so the exit rule wins the cascade', () => {
    render(<Box exitStyle={EXIT_SLOW} transition="opacity 200ms ease" data-testid="x" />);
    const el = container.querySelector('[data-testid="x"]') as HTMLElement;
    // Base transition is no longer inline (1,0,0,0) — it was lifted to a class
    // block so the attribute-qualified exit rule can override it.
    expect(el.style.transition).toBe('');
    // The base (enter) transition still exists, now as a class rule.
    expect(styleText()).toMatch(/transition:\s*opacity 200ms ease[;\s}]/);
  });

  it('keeps the base transition inline when exitStyle does not override it', () => {
    // No transition inside exitStyle → nothing to lift → base stays inline,
    // identical to the pre-asymmetric behavior.
    render(<Box exitStyle={EXIT_PLAIN} transition="opacity 200ms ease" data-testid="x" />);
    const el = container.querySelector('[data-testid="x"]') as HTMLElement;
    expect(el.style.transition).toBe('opacity 200ms ease');
  });

  it('resolves $token references in the exit transition to CSS vars', () => {
    render(<Box exitStyle={EXIT_TOKEN} transition="opacity 200ms ease" data-testid="x" />);
    const exitRule = styleText()
      .split('}')
      .map((r) => `${r}}`)
      .find((r) => r.includes('exiting'));
    expect(exitRule).toMatch(/var\(--durations-3\)/);
  });
});

describe('Box — motion warning with per-phase transition', () => {
  it('does not warn when exitStyle carries its own transition (no base transition)', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(<Box exitStyle={EXIT_OWN} data-testid="x" />);
    const motionWarnings = warn.mock.calls.filter((c) =>
      String(c[0]).includes('without a `transition`'),
    );
    expect(motionWarnings).toHaveLength(0);
  });

  it('still warns when exitStyle has no transition anywhere', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(<Box exitStyle={EXIT_PLAIN} data-testid="x" />);
    const motionWarnings = warn.mock.calls.filter((c) =>
      String(c[0]).includes('without a `transition`'),
    );
    expect(motionWarnings.length).toBeGreaterThan(0);
  });
});
