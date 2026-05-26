/** @vitest-environment jsdom */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { Text } from './Text.js';

let container: HTMLElement;
let root: Root;

function render(node: ReactNode): void {
  act(() => {
    root.render(node);
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

describe('Text — lines prop (#31)', () => {
  it('renders without the line-clamp styles when `lines` is omitted', () => {
    render(<Text>plain</Text>);
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.whiteSpace).toBe('');
    expect(el.style.textOverflow).toBe('');
    expect(el.style.display).toBe('');
  });

  it('lines={1} emits the canonical single-line ellipsis triplet', () => {
    render(<Text lines={1}>a long single-line piece of text</Text>);
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.whiteSpace).toBe('nowrap');
    expect(el.style.overflow).toBe('hidden');
    expect(el.style.textOverflow).toBe('ellipsis');
  });

  it('lines={2} emits the -webkit-line-clamp set', () => {
    render(<Text lines={2}>truncate me to two lines</Text>);
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.display).toBe('-webkit-box');
    // React serialises camelCase webkit props with the vendor prefix.
    // jsdom exposes them via WebkitLineClamp / WebkitBoxOrient.
    expect((el.style as unknown as { WebkitLineClamp?: string }).WebkitLineClamp).toBe('2');
    expect((el.style as unknown as { WebkitBoxOrient?: string }).WebkitBoxOrient).toBe('vertical');
    expect(el.style.overflow).toBe('hidden');
    // whiteSpace shouldn't be touched for multi-line clamp.
    expect(el.style.whiteSpace).toBe('');
  });

  it('lines={5} emits clamp at N=5', () => {
    render(<Text lines={5}>long text</Text>);
    const el = container.firstElementChild as HTMLElement;
    expect((el.style as unknown as { WebkitLineClamp?: string }).WebkitLineClamp).toBe('5');
  });

  it('user `style` overrides individual clamp declarations', () => {
    // User opting out of `overflow: hidden` while keeping the rest of
    // the lines={1} triplet.
    render(
      <Text lines={1} style={{ overflow: 'visible' }}>
        x
      </Text>,
    );
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.whiteSpace).toBe('nowrap');
    expect(el.style.textOverflow).toBe('ellipsis');
    expect(el.style.overflow).toBe('visible');
  });

  it('still renders the default <span> tag with lines', () => {
    render(<Text lines={1}>x</Text>);
    const el = container.firstElementChild as HTMLElement;
    expect(el.tagName.toLowerCase()).toBe('span');
  });

  it('passes other style props through (fontSize stays applied)', () => {
    render(
      <Text lines={1} fontSize={20}>
        x
      </Text>,
    );
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.fontSize).toBe('20px');
    expect(el.style.whiteSpace).toBe('nowrap');
  });
});
