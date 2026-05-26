import {
  Children,
  isValidElement,
  useImperativeHandle,
  useRef,
  type Ref,
  type ReactElement,
  type ReactNode,
} from 'react';
import { ScrollView as RNScrollView } from 'react-native';
import { Box, useResolvedBoxStyle, type BoxProps } from './Box.js';

/**
 * Snapshot of a `ScrollView`'s scroll geometry. All measurements are
 * in unscaled DIPs (RN's native scroll-event units).
 */
export interface ScrollState {
  scrollX: number;
  scrollY: number;
  contentWidth: number;
  contentHeight: number;
  layoutWidth: number;
  layoutHeight: number;
}

/**
 * Internal scroll publisher held by `ScrollView`. The `useScroll` hook
 * subscribes via `ref.current.__publisher.subscribe(...)` and reads
 * `getState()` on every notification.
 *
 * Not part of the public surface — the field is underscore-prefixed
 * to flag it as motif-internal.
 */
export interface ScrollPublisher {
  getState(): ScrollState;
  subscribe(cb: () => void): () => void;
}

/**
 * Ref shape exposed by motif's native `ScrollView`. Carries the
 * scroll publisher used by `useScroll`. Future ergonomics (e.g.,
 * imperative `scrollTo`) hang off this interface.
 */
export interface MotifScrollViewRef {
  __publisher: ScrollPublisher;
}

interface MutableScrollPublisher extends ScrollPublisher {
  __push(next: ScrollState): void;
}

function createScrollPublisher(): MutableScrollPublisher {
  let state: ScrollState = {
    scrollX: 0,
    scrollY: 0,
    contentWidth: 0,
    contentHeight: 0,
    layoutWidth: 0,
    layoutHeight: 0,
  };
  const subscribers = new Set<() => void>();
  return {
    getState: () => state,
    subscribe(cb: () => void): () => void {
      subscribers.add(cb);
      return () => {
        subscribers.delete(cb);
      };
    },
    __push(next: ScrollState): void {
      state = next;
      for (const cb of subscribers) cb();
    },
  };
}

/** RN-native scroll event shape we depend on. Typed structurally so
 * the mock in tests (which fires a plain object, not a real synthetic
 * event) satisfies the contract without a full `react-native` type
 * import. */
interface NativeScrollEventLike {
  nativeEvent: {
    contentOffset: { x: number; y: number };
    contentSize: { width: number; height: number };
    layoutMeasurement: { width: number; height: number };
  };
}

/**
 * ScrollView — wraps RN's ScrollView with motif's prop schema. Box-
 * level style props resolve into RN's `contentContainerStyle` so the
 * scrollable region is styled directly without an extra View wrapper;
 * children are direct children of the RN ScrollView so any `<Sticky>`
 * descendants surface as `stickyHeaderIndices` for free.
 *
 * Pass a `ref` to bind a {@link useScroll} hook to this container —
 * the ref's `__publisher` exposes scroll state as motion values via
 * the hook.
 */
export interface ScrollViewProps extends BoxProps {
  direction?: 'vertical' | 'horizontal' | 'both';
  hideScrollbar?: boolean;
  children?: ReactNode;
  /** Forwarded onScroll handler. Fires on every scroll event the
   * underlying RN ScrollView emits; motif also reads each event to
   * publish to any registered {@link useScroll} subscribers. */
  onScroll?: (event: NativeScrollEventLike) => void;
  /** Throttle for RN's native scroll events, in ms. Defaults to `16`
   * (≈60fps) so `useScroll` motion values update once per frame. */
  scrollEventThrottle?: number;
  /** Ref to motif's scroll publisher. Pass a `useRef<MotifScrollViewRef>(null)`
   * and hand the same ref to `useScroll({ container: ref })`. */
  ref?: Ref<MotifScrollViewRef>;
}
export function ScrollView({
  direction = 'vertical',
  hideScrollbar = false,
  children,
  style: userStyle,
  onScroll: consumerOnScroll,
  scrollEventThrottle = 16,
  ref,
  ...rest
}: ScrollViewProps): ReactElement {
  const { style: contentStyle, passThrough } = useResolvedBoxStyle(rest, userStyle);
  const stickyIndices = collectStickyIndices(children);

  // Publisher singleton for this component's lifetime. Held in a ref
  // so reads are stable; the imperative handle below exposes it as
  // the consumer-facing `__publisher` slot.
  const publisherRef = useRef<MutableScrollPublisher | null>(null);
  if (publisherRef.current === null) {
    publisherRef.current = createScrollPublisher();
  }
  const publisher = publisherRef.current;

  useImperativeHandle(ref, (): MotifScrollViewRef => ({ __publisher: publisher }), [publisher]);

  const onScroll = (event: NativeScrollEventLike): void => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    publisher.__push({
      scrollX: contentOffset.x,
      scrollY: contentOffset.y,
      contentWidth: contentSize.width,
      contentHeight: contentSize.height,
      layoutWidth: layoutMeasurement.width,
      layoutHeight: layoutMeasurement.height,
    });
    consumerOnScroll?.(event);
  };

  return (
    <RNScrollView
      {...(passThrough as Record<string, unknown>)}
      horizontal={direction === 'horizontal'}
      showsVerticalScrollIndicator={!hideScrollbar && direction !== 'horizontal'}
      showsHorizontalScrollIndicator={!hideScrollbar && direction !== 'vertical'}
      contentContainerStyle={contentStyle}
      onScroll={onScroll}
      scrollEventThrottle={scrollEventThrottle}
      {...(stickyIndices.length > 0 ? { stickyHeaderIndices: stickyIndices } : {})}
    >
      {children}
    </RNScrollView>
  );
}

/**
 * Walk the direct children of `<ScrollView>` and collect the indices of
 * any `<Sticky>` instances. The result feeds `stickyHeaderIndices` on
 * the underlying RN ScrollView. Only direct children are scanned — RN's
 * sticky machinery doesn't see deeper.
 */
function collectStickyIndices(children: ReactNode): number[] {
  const indices: number[] = [];
  Children.toArray(children).forEach((child, i) => {
    if (isValidElement(child) && child.type === Sticky) indices.push(i);
  });
  return indices;
}

/**
 * Sticky on native — RN doesn't have CSS `position: sticky`. Instead,
 * RN's `<ScrollView stickyHeaderIndices={[...]}>` pins the listed
 * direct children to the top of the scroll area while they're in view.
 *
 * Motif's `<Sticky>` is a marker: when used as a **direct child** of
 * `<ScrollView>`, the parent collects its index and forwards it via
 * `stickyHeaderIndices`. Nesting Sticky deeper than that doesn't
 * sticky-pin (RN's machinery only sees direct children); document and
 * accept that limitation rather than building a competing
 * polyfill.
 *
 * The children render inside a styled Box so Box-level style props
 * (background, padding, etc.) still apply — this lets the sticky
 * header carry its own visual style and not bleed through the scroll
 * content above it.
 */
export interface StickyProps extends BoxProps {
  /**
   * Reserved for parity with the web `position: sticky` API. Not used
   * by RN's `stickyHeaderIndices` mechanism; kept on the prop surface
   * so cross-platform code compiles.
   */
  top?: number | string;
  bottom?: number | string;
  zIndex?: number;
  children?: ReactNode;
}
export function Sticky({
  top: _top,
  bottom: _bottom,
  zIndex: _zIndex,
  children,
  ...rest
}: StickyProps): ReactElement {
  return <Box {...rest}>{children}</Box>;
}

export interface VirtualListProps<T> extends Omit<ScrollViewProps, 'children'> {
  data: readonly T[];
  renderItem: (item: T, index: number) => ReactNode;
  keyOf?: (item: T, index: number) => string | number;
  itemHeight?: number;
}

/**
 * Custom virtualisation function. Receives the same props as
 * `<VirtualList>`; returns a React element that renders the list.
 * Native consumers usually wrap `@shopify/flash-list`.
 */
export type VirtualListImpl = <T>(props: VirtualListProps<T>) => ReactElement;

interface VirtualListRegistry {
  impl: VirtualListImpl | null;
  threshold: number;
}
const virtualListRegistry: VirtualListRegistry = { impl: null, threshold: 50 };

/**
 * Register a custom virtualised renderer. Below `threshold` items
 * (default 50), motif renders every row directly; above, it
 * delegates to the registered impl. Pass `null` to clear.
 *
 * ```ts
 * import { FlashList } from '@shopify/flash-list';
 * import { registerVirtualListImpl } from '@usemotif/react-native';
 *
 * registerVirtualListImpl(({ data, renderItem, keyOf, itemHeight }) => (
 *   <FlashList
 *     data={data}
 *     renderItem={({ item, index }) => renderItem(item, index)}
 *     keyExtractor={(item, i) => String(keyOf?.(item, i) ?? i)}
 *     estimatedItemSize={itemHeight}
 *   />
 * ));
 * ```
 */
export function registerVirtualListImpl(
  impl: VirtualListImpl | null,
  options?: { threshold?: number },
): void {
  virtualListRegistry.impl = impl;
  if (options?.threshold !== undefined) virtualListRegistry.threshold = options.threshold;
}

export function _getVirtualListRegistryForTesting(): Readonly<VirtualListRegistry> {
  return virtualListRegistry;
}

export function VirtualList<T>(props: VirtualListProps<T>): ReactElement {
  const { data, renderItem, keyOf, itemHeight: _itemHeight, ...rest } = props;
  const { impl, threshold } = virtualListRegistry;
  if (impl !== null && data.length >= threshold) {
    return impl(props);
  }
  return (
    <ScrollView {...rest}>
      {data.map((item, i) => (
        <Box key={keyOf?.(item, i) ?? i}>{renderItem(item, i)}</Box>
      ))}
    </ScrollView>
  );
}
