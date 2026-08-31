/** @vitest-environment jsdom */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, type ComponentType, type ReactElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';

/**
 * Mock `@shopify/flash-list` BEFORE importing the wrapper so the
 * wrapper picks up the stub. The stub renders a `<div>` host carrying
 * the relevant props as `data-*` attributes; tests assert against
 * those to verify the adapter shape.
 */
vi.mock('@shopify/flash-list', () => ({
  FlashList: <T,>(props: {
    data: readonly T[];
    renderItem: (info: { item: T; index: number }) => ReactElement | null;
    keyExtractor?: (item: T, index: number) => string;
  }): ReactElement => {
    return (
      <div data-mock="FlashList" data-count={props.data.length}>
        {props.data.map((item, index) => {
          const key = props.keyExtractor?.(item, index) ?? String(index);
          return (
            <div key={key} data-mock-key={key} data-mock-index={index}>
              {props.renderItem({ item, index })}
            </div>
          );
        })}
      </div>
    );
  },
}));

import { flashListImpl } from './flash-list.js';
import type { VirtualListProps } from '../scroll.js';

interface Row {
  id: string;
  label: string;
}

const Impl = flashListImpl as ComponentType<VirtualListProps<Row>>;

let container: HTMLElement;
let root: Root;

function render(node: ReactElement): void {
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
  act(() => {
    root.unmount();
  });
  document.body.removeChild(container);
});

const ROWS: Row[] = Array.from({ length: 5 }, (_, i) => ({
  id: `row-${i}`,
  label: `Row ${i}`,
}));

describe('flashListImpl', () => {
  it('renders a FlashList host with the data passed through', () => {
    render(<Impl data={ROWS} renderItem={(item: Row) => <span>{item.label}</span>} />);
    const flash = container.querySelector('[data-mock="FlashList"]') as HTMLElement;
    expect(flash).not.toBeNull();
    expect(flash.getAttribute('data-count')).toBe('5');
  });

  it("forwards renderItem with (item, index) - unwrapping FlashList's {item, index} shape", () => {
    render(
      <Impl
        data={ROWS}
        renderItem={(item: Row, index: number) => (
          <span data-row={item.id} data-index={index}>
            {item.label}
          </span>
        )}
      />,
    );
    const rows = container.querySelectorAll('[data-row]');
    expect(rows.length).toBe(5);
    expect(rows[0]?.getAttribute('data-row')).toBe('row-0');
    expect(rows[0]?.getAttribute('data-index')).toBe('0');
    expect(rows[4]?.getAttribute('data-index')).toBe('4');
  });

  it('uses keyOf for keyExtractor when provided', () => {
    render(
      <Impl
        data={ROWS}
        renderItem={(item: Row) => <span>{item.label}</span>}
        keyOf={(item: Row) => `k-${item.id}`}
      />,
    );
    const wrapped = container.querySelectorAll('[data-mock-key]');
    expect(wrapped[0]?.getAttribute('data-mock-key')).toBe('k-row-0');
    expect(wrapped[4]?.getAttribute('data-mock-key')).toBe('k-row-4');
  });

  it('falls back to index when keyOf is omitted', () => {
    render(<Impl data={ROWS} renderItem={(item: Row) => <span>{item.label}</span>} />);
    const wrapped = container.querySelectorAll('[data-mock-key]');
    expect(wrapped[0]?.getAttribute('data-mock-key')).toBe('0');
    expect(wrapped[4]?.getAttribute('data-mock-key')).toBe('4');
  });
});
