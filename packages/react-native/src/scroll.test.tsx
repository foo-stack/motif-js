import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import type { Theme } from '@motif-js/core';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Box } from './Box.js';
import { ScrollView, Sticky } from './scroll.js';
import { ThemeProvider } from './Theme.js';

let container: HTMLElement;
let root: Root;

const theme: Theme = {
  name: 'test',
  tokens: {
    space: { 1: 4, 2: 8, 4: 16 },
    colors: { surface: { base: '#fff' } },
  },
};

function render(node: React.ReactNode): void {
  act(() => {
    root.render(
      <ThemeProvider themes={[theme]} active="test">
        {node}
      </ThemeProvider>,
    );
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

function getStickyIndices(): number[] | undefined {
  const sv = container.querySelector('[data-motif-host="ScrollView"]');
  const attr = sv?.getAttribute('data-sticky-indices');
  return attr === null || attr === undefined ? undefined : (JSON.parse(attr) as number[]);
}

describe('native ScrollView — sticky integration', () => {
  it('does NOT pass stickyHeaderIndices when no Sticky children are present', () => {
    render(
      <ScrollView>
        <Box>a</Box>
        <Box>b</Box>
      </ScrollView>,
    );
    expect(getStickyIndices()).toBeUndefined();
  });

  it('collects indices of direct Sticky children', () => {
    render(
      <ScrollView>
        <Box>row 0</Box>
        <Sticky>row 1 (sticky)</Sticky>
        <Box>row 2</Box>
        <Sticky>row 3 (sticky)</Sticky>
        <Box>row 4</Box>
      </ScrollView>,
    );
    expect(getStickyIndices()).toEqual([1, 3]);
  });

  it('does NOT find Sticky nested deeper than direct children', () => {
    render(
      <ScrollView>
        <Box>
          <Sticky>nested</Sticky>
        </Box>
      </ScrollView>,
    );
    expect(getStickyIndices()).toBeUndefined();
  });

  it('handles a single Sticky at index 0', () => {
    render(
      <ScrollView>
        <Sticky>header</Sticky>
        <Box>body</Box>
      </ScrollView>,
    );
    expect(getStickyIndices()).toEqual([0]);
  });
});
