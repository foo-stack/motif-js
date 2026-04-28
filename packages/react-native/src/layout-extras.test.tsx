import type { Theme } from '@motif-js/core';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  AspectRatio,
  Center,
  Flex,
  Grid,
  SafeArea,
  Spacer,
  Wrap,
  ZStack,
} from './layout-extras.js';
import { ThemeProvider } from './Theme.js';

const theme: Theme = { name: 'test', tokens: { colors: { red: { 500: '#ef4444' } } } };

let container: HTMLElement;
let root: Root;

function render(node: React.ReactNode): void {
  act(() => root.render(node));
}

function firstHost(name: string): HTMLElement {
  const el = container.querySelector(`[data-motif-host="${name}"]`);
  if (el === null) throw new Error(`No ${name} found`);
  return el as HTMLElement;
}

function styleOn(el: HTMLElement): Record<string, unknown> {
  const raw = el.getAttribute('data-motif-style');
  if (raw === null) return {};
  const parsed = JSON.parse(raw) as unknown;
  if (Array.isArray(parsed)) {
    return parsed.reduce<Record<string, unknown>>((acc, x) => Object.assign(acc, x ?? {}), {});
  }
  return parsed as Record<string, unknown>;
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

describe('layout-extras (native)', () => {
  it('Spacer applies flex: 1', () => {
    render(<Spacer />);
    expect(styleOn(firstHost('View')).flex).toBe(1);
  });

  it('Center sets alignItems + justifyContent center', () => {
    render(<Center>x</Center>);
    const s = styleOn(firstHost('View'));
    expect(s.alignItems).toBe('center');
    expect(s.justifyContent).toBe('center');
  });

  it('Wrap sets flex-wrap and row direction', () => {
    render(<Wrap>x</Wrap>);
    const s = styleOn(firstHost('View'));
    expect(s.flexWrap).toBe('wrap');
    expect(s.flexDirection).toBe('row');
  });

  it('AspectRatio sets aspectRatio', () => {
    render(<AspectRatio ratio={2}>x</AspectRatio>);
    const s = styleOn(firstHost('View'));
    expect(s.aspectRatio).toBe(2);
  });

  it('Grid columns polyfill: row-direction wrap with per-child flexBasis', () => {
    render(
      <Grid columns={4}>
        <span>a</span>
        <span>b</span>
      </Grid>,
    );
    const outer = styleOn(firstHost('View'));
    expect(outer.flexDirection).toBe('row');
    expect(outer.flexWrap).toBe('wrap');
    // Children get flexBasis: 25%.
    const html = container.innerHTML;
    expect(html).toContain('25%');
  });

  it('Flex direction prop maps to flexDirection', () => {
    render(<Flex direction="column">x</Flex>);
    expect(styleOn(firstHost('View')).flexDirection).toBe('column');
  });

  it('SafeArea wraps content in SafeAreaView', () => {
    render(
      <ThemeProvider themes={[theme]} active="test">
        <SafeArea bg="$colors.red.500">x</SafeArea>
      </ThemeProvider>,
    );
    expect(container.querySelector('[data-motif-host="SafeAreaView"]')).not.toBeNull();
  });

  it('ZStack: first child natural, subsequent children absolute', () => {
    render(
      <ZStack>
        <span>a</span>
        <span>b</span>
      </ZStack>,
    );
    // Inner wrappers — second one should carry position: absolute.
    const html = container.innerHTML;
    expect(html).toContain('absolute');
  });
});
