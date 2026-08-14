/** @vitest-environment jsdom */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { createTheme } from '@usemotif/core';
import { Box } from './Box.js';
import { ThemeProvider } from './Theme.js';
import { _resetStyleCacheForTesting } from './style-cache.js';

let container: HTMLElement;
let root: Root;

function render(node: ReactNode): void {
  act(() => {
    root.render(node);
  });
}

const theme = createTheme({ name: 'test', tokens: { colors: { brand: '#c0ffee' } } });
const themes = [theme];

function withLayer(node: ReactNode, cssLayer?: string): ReactNode {
  return (
    <ThemeProvider themes={themes} active="test" cssLayer={cssLayer}>
      {node}
    </ThemeProvider>
  );
}

beforeEach(() => {
  _resetStyleCacheForTesting();
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  document.head.querySelectorAll('style[data-motif-style-cache]').forEach((el) => el.remove());
});

function getEmittedCss(): string {
  return document.head.querySelector('style[data-motif-style-cache]')?.textContent ?? '';
}

function getBox(): HTMLElement {
  return container.querySelector('[data-testid="b"]') as HTMLElement;
}

describe('Box — cssLayer (#319)', () => {
  it('keeps base props inline and emits no layer by default', () => {
    render(withLayer(<Box data-testid="b" bg="red" p={4} />));

    const el = getBox();
    expect(el.style.backgroundColor).toBe('red');
    expect(getEmittedCss()).not.toContain('@layer');
  });

  it('moves base props out of inline style into a layered class', () => {
    // This is the whole point of the feature: an inline style has specificity
    // 1,0,0,0 and cannot belong to a layer, so a host stylesheet could never
    // win against it. As a class inside a layer, layer order decides.
    render(withLayer(<Box data-testid="b" bg="red" p={4} />, 'motif'));

    const el = getBox();
    expect(el.style.backgroundColor).toBe('');
    expect(el.className).toMatch(/m-[a-z0-9]+/);

    const css = getEmittedCss();
    expect(css).toContain('@layer motif {');
    expect(css).toContain('background-color: red');
  });

  it('layers pseudo-state rules too', () => {
    render(withLayer(<Box data-testid="b" bg="red" _hover={{ bg: 'blue' }} />, 'motif'));

    const css = getEmittedCss();
    expect(css).toContain('@layer motif {');
    expect(css).toMatch(/@layer motif \{[^}]*:hover/);
  });

  it('keeps the base block before responsive overrides inside the layer', () => {
    // Layer membership does not change specificity or source order *within*
    // the layer, so the base block still has to come first.
    render(withLayer(<Box data-testid="b" p={{ base: 4, md: 8 }} />, 'motif'));

    const css = getEmittedCss();
    const baseIdx = css.indexOf('padding: 4px');
    const mdIdx = css.indexOf('@media');
    expect(baseIdx).toBeGreaterThanOrEqual(0);
    expect(mdIdx).toBeGreaterThan(baseIdx);
  });

  it('gives the same declarations layered and unlayered', () => {
    render(withLayer(<Box data-testid="b" bg="red" p={4} />, 'motif'));
    const layered = getEmittedCss();

    expect(layered).toContain('background-color: red');
    expect(layered).toContain('padding: 4px');
  });

  it('emits different class names per layer so two layers cannot collide', () => {
    render(withLayer(<Box data-testid="b" bg="red" />, 'motif'));
    const first = getBox().className;

    act(() => root.unmount());
    container.remove();
    _resetStyleCacheForTesting();
    document.head.querySelectorAll('style[data-motif-style-cache]').forEach((el) => el.remove());
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);

    render(withLayer(<Box data-testid="b" bg="red" />, 'other'));
    expect(getBox().className).not.toBe(first);
  });

  it('wraps the theme variable block in the layer', () => {
    render(withLayer(<Box data-testid="b" />, 'motif'));

    const themeStyle = document.querySelector('style[data-motif-themes="root"]');
    expect(themeStyle?.textContent).toContain('@layer motif {');
    expect(themeStyle?.textContent).toContain('--colors-brand');
  });

  it('leaves the theme block unlayered by default', () => {
    render(withLayer(<Box data-testid="b" />));

    const themeStyle = document.querySelector('style[data-motif-themes="root"]');
    expect(themeStyle?.textContent).not.toContain('@layer');
  });

  it('rejects a layer name that could break out of the block', () => {
    expect(() => render(withLayer(<Box data-testid="b" bg="red" />, 'x { } .evil'))).toThrow(
      /invalid CSS layer name/,
    );
  });
});
