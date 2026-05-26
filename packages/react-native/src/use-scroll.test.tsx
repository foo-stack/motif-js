/** @vitest-environment jsdom */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, useRef, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { ScrollView, type MotifScrollViewRef } from './scroll.js';
import { useScroll } from './use-scroll.js';
import type { MotionValue } from '@usemotif/core';

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

type Captured = {
  scrollX: MotionValue<number>;
  scrollY: MotionValue<number>;
  scrollXProgress: MotionValue<number>;
  scrollYProgress: MotionValue<number>;
};

function Harness({ onValues }: { onValues: (v: Captured) => void }): ReactNode {
  const ref = useRef<MotifScrollViewRef>(null);
  return (
    <ScrollView ref={ref} testID="scroller">
      <Probe ref={ref} onValues={onValues} />
    </ScrollView>
  );
}

function Probe({
  ref,
  onValues,
}: {
  ref: { current: MotifScrollViewRef | null };
  onValues: (v: Captured) => void;
}): null {
  const values = useScroll({ container: ref });
  onValues(values);
  return null;
}

/** Dispatch a native-shaped scroll event on the mock ScrollView host. */
function fireScroll(
  host: HTMLElement,
  state: {
    x: number;
    y: number;
    contentWidth: number;
    contentHeight: number;
    layoutWidth: number;
    layoutHeight: number;
  },
): void {
  act(() => {
    host.dispatchEvent(
      new CustomEvent('motif:scroll', {
        detail: {
          contentOffset: { x: state.x, y: state.y },
          contentSize: { width: state.contentWidth, height: state.contentHeight },
          layoutMeasurement: { width: state.layoutWidth, height: state.layoutHeight },
        },
      }),
    );
  });
}

describe('native useScroll', () => {
  it('returns four motion values seeded at 0', () => {
    const onValues = vi.fn();
    render(<Harness onValues={onValues} />);
    const v = onValues.mock.calls[0]![0] as Captured;
    expect(v.scrollX.get()).toBe(0);
    expect(v.scrollY.get()).toBe(0);
    expect(v.scrollXProgress.get()).toBe(0);
    expect(v.scrollYProgress.get()).toBe(0);
  });

  it('updates motion values when the ScrollView fires onScroll', () => {
    const onValues = vi.fn();
    render(<Harness onValues={onValues} />);
    const v = onValues.mock.calls[0]![0] as Captured;
    const host = container.querySelector('[data-motif-host="ScrollView"]') as HTMLElement;

    fireScroll(host, {
      x: 100,
      y: 250,
      contentWidth: 1000,
      contentHeight: 2000,
      layoutWidth: 500,
      layoutHeight: 800,
    });

    expect(v.scrollX.get()).toBe(100);
    expect(v.scrollY.get()).toBe(250);
    // maxX = 1000 - 500 = 500 → 100/500 = 0.2
    expect(v.scrollXProgress.get()).toBeCloseTo(0.2);
    // maxY = 2000 - 800 = 1200 → 250/1200 ≈ 0.208
    expect(v.scrollYProgress.get()).toBeCloseTo(250 / 1200);
  });

  it('clamps progress to 0 when the content fits the layout on an axis', () => {
    const onValues = vi.fn();
    render(<Harness onValues={onValues} />);
    const v = onValues.mock.calls[0]![0] as Captured;
    const host = container.querySelector('[data-motif-host="ScrollView"]') as HTMLElement;

    fireScroll(host, {
      x: 0,
      y: 0,
      contentWidth: 500,
      contentHeight: 800,
      layoutWidth: 500,
      layoutHeight: 800,
    });

    expect(v.scrollXProgress.get()).toBe(0);
    expect(v.scrollYProgress.get()).toBe(0);
  });

  it('forwards consumer onScroll alongside the publisher update', () => {
    const consumerOnScroll = vi.fn();
    function ConsumerHarness({ onValues }: { onValues: (v: Captured) => void }): ReactNode {
      const ref = useRef<MotifScrollViewRef>(null);
      return (
        <ScrollView ref={ref} onScroll={consumerOnScroll} testID="scroller">
          <Probe ref={ref} onValues={onValues} />
        </ScrollView>
      );
    }

    const onValues = vi.fn();
    render(<ConsumerHarness onValues={onValues} />);
    const host = container.querySelector('[data-motif-host="ScrollView"]') as HTMLElement;

    fireScroll(host, {
      x: 0,
      y: 100,
      contentWidth: 1000,
      contentHeight: 2000,
      layoutWidth: 500,
      layoutHeight: 1000,
    });

    expect(consumerOnScroll).toHaveBeenCalledOnce();
    expect(consumerOnScroll.mock.calls[0]![0].nativeEvent.contentOffset.y).toBe(100);
    const v = onValues.mock.calls[0]![0] as Captured;
    expect(v.scrollY.get()).toBe(100);
  });

  it('motion-value updates do not re-render the consumer', () => {
    const onValues = vi.fn();
    render(<Harness onValues={onValues} />);
    const renderCountAfterMount = onValues.mock.calls.length;
    const host = container.querySelector('[data-motif-host="ScrollView"]') as HTMLElement;

    fireScroll(host, {
      x: 0,
      y: 10,
      contentWidth: 1000,
      contentHeight: 2000,
      layoutWidth: 500,
      layoutHeight: 1000,
    });
    fireScroll(host, {
      x: 0,
      y: 20,
      contentWidth: 1000,
      contentHeight: 2000,
      layoutWidth: 500,
      layoutHeight: 1000,
    });

    expect(onValues.mock.calls.length).toBe(renderCountAfterMount);
  });
});
