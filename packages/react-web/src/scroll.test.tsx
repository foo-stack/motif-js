import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it } from 'vitest';
import {
  VirtualList,
  _getVirtualListRegistryForTesting,
  registerVirtualListImpl,
} from './scroll.js';

afterEach(() => {
  registerVirtualListImpl(null, { threshold: 50 });
});

describe('VirtualList — fallback path', () => {
  it('renders every row when no impl is registered', () => {
    const data = Array.from({ length: 200 }, (_, i) => i);
    const html = renderToStaticMarkup(
      <VirtualList data={data} renderItem={(i) => <span data-row={i}>row {i}</span>} />,
    );
    const matches = html.match(/data-row=/g);
    expect(matches?.length).toBe(200);
  });

  it('uses keyOf for stable item keys', () => {
    const data = [{ id: 'a' }, { id: 'b' }];
    const html = renderToStaticMarkup(
      <VirtualList
        data={data}
        keyOf={(item) => item.id}
        renderItem={(item) => <span>{item.id}</span>}
      />,
    );
    expect(html).toContain('a');
    expect(html).toContain('b');
  });
});

describe('VirtualList — registered impl', () => {
  it('delegates to the registered impl above threshold', () => {
    let calls = 0;
    registerVirtualListImpl(
      ((props: { data: readonly unknown[] }) => {
        calls++;
        return <div data-virtuoso-len={props.data.length} />;
      }) as unknown as Parameters<typeof registerVirtualListImpl>[0],
      { threshold: 10 },
    );
    const data = Array.from({ length: 12 }, (_, i) => i);
    const html = renderToStaticMarkup(
      <VirtualList data={data} renderItem={(i) => <span>row {i}</span>} />,
    );
    expect(calls).toBe(1);
    expect(html).toContain('data-virtuoso-len="12"');
    expect(html).not.toContain('row');
  });

  it('falls back below threshold even when impl is registered', () => {
    let calls = 0;
    registerVirtualListImpl(
      ((_props: unknown) => {
        calls++;
        return <div />;
      }) as unknown as Parameters<typeof registerVirtualListImpl>[0],
      { threshold: 50 },
    );
    const data = Array.from({ length: 10 }, (_, i) => i);
    const html = renderToStaticMarkup(
      <VirtualList data={data} renderItem={(i) => <span data-row={i}>row {i}</span>} />,
    );
    expect(calls).toBe(0);
    expect(html.match(/data-row=/g)?.length).toBe(10);
  });

  it('clears the registration when impl is set to null', () => {
    registerVirtualListImpl(
      ((_props: unknown) => <div data-virtuoso="1" />) as unknown as Parameters<
        typeof registerVirtualListImpl
      >[0],
      { threshold: 1 },
    );
    expect(_getVirtualListRegistryForTesting().impl).not.toBeNull();
    registerVirtualListImpl(null);
    expect(_getVirtualListRegistryForTesting().impl).toBeNull();
  });
});
