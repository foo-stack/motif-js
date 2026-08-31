/** @vitest-environment jsdom */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, useRef, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { ScrollView, type MotifScrollViewRef } from './scroll.js';
import { useScroll, useScrollTarget, type ScrollTargetHandle } from './use-scroll.js';
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

  it('returns a stable target handle from useScrollTarget across renders', () => {
    let first: ScrollTargetHandle | undefined;
    let second: ScrollTargetHandle | undefined;
    function Probe(): null {
      const t = useScrollTarget();
      if (first === undefined) first = t;
      else second = t;
      return null;
    }
    function Holder({ tick }: { tick: number }) {
      return <Probe key={tick} />;
    }
    // Note: re-render of the SAME component (not remount) keeps the
    // handle stable. Use a wrapping rerender to validate.
    function Wrapper(): ReactNode {
      const refOuter = useRef<MotifScrollViewRef>(null);
      return (
        <ScrollView ref={refOuter} testID="s">
          <Holder tick={0} />
        </ScrollView>
      );
    }
    render(<Wrapper />);
    // Force a re-render by re-rendering the root.
    render(<Wrapper />);
    expect(first).toBeDefined();
    expect(second).toBeDefined();
    expect(first).toBe(second);
  });

  it('reports target-relative progress using the layout snapshot + scroll position', () => {
    let captured: Captured | undefined;
    let captureTarget: ScrollTargetHandle | undefined;
    function TargetHarness(): ReactNode {
      const ref = useRef<MotifScrollViewRef>(null);
      const target = useScrollTarget();
      captureTarget = target;
      function Inner(): null {
        const values = useScroll({ container: ref, target });
        captured = values;
        return null;
      }
      return (
        <ScrollView ref={ref} testID="scroller">
          <Inner />
        </ScrollView>
      );
    }
    render(<TargetHarness />);
    expect(captureTarget).toBeDefined();
    // Seed the target's layout manually - the Box host that would
    // normally fire onLayout isn't part of this test.
    captureTarget!.onLayout({
      nativeEvent: { layout: { x: 0, y: 800, width: 1000, height: 400 } },
    } as Parameters<ScrollTargetHandle['onLayout']>[0]);

    const host = container.querySelector('[data-motif-host="ScrollView"]') as HTMLElement;

    // At scrollY=0, viewportHeight=800, element layout y=800 → progress=0
    // (top edge sits at viewport bottom).
    fireScroll(host, {
      x: 0,
      y: 0,
      contentWidth: 1000,
      contentHeight: 3000,
      layoutWidth: 1000,
      layoutHeight: 800,
    });
    expect(captured!.scrollYProgress.get()).toBe(0);

    // At scrollY=1200, the element bottom (y+h = 1200) aligns with the
    // viewport top → progress=1.
    fireScroll(host, {
      x: 0,
      y: 1200,
      contentWidth: 1000,
      contentHeight: 3000,
      layoutWidth: 1000,
      layoutHeight: 800,
    });
    expect(captured!.scrollYProgress.get()).toBe(1);
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
