'use client';

import type { CSSProperties, ReactElement, ReactNode } from 'react';
import { Box, type BoxProps } from './Box.js';

/**
 * ScrollView — a styled container that scrolls when its content
 * overflows. Defaults to vertical scrolling. Pass `direction='horizontal'`
 * for a horizontal scroller, or `'both'` for two-axis.
 *
 * On web, this is `overflow: auto` plus a few quality-of-life
 * defaults: `WebkitOverflowScrolling: touch` (iOS Safari momentum)
 * and `overscrollBehavior: contain` (so scrolling inside the view
 * doesn't bubble up past the parent).
 */
export interface ScrollViewProps extends BoxProps {
  direction?: 'vertical' | 'horizontal' | 'both';
  /** Hide the scrollbar visually (still scrollable + accessible). */
  hideScrollbar?: boolean;
  children?: ReactNode;
}
export function ScrollView({
  direction = 'vertical',
  hideScrollbar = false,
  children,
  style,
  ...rest
}: ScrollViewProps): ReactElement {
  const overflow: CSSProperties =
    direction === 'horizontal'
      ? { overflowX: 'auto', overflowY: 'hidden' }
      : direction === 'both'
        ? { overflow: 'auto' }
        : { overflowY: 'auto', overflowX: 'hidden' };

  const scrollbar: CSSProperties = hideScrollbar ? { scrollbarWidth: 'none' } : {};

  return (
    <Box
      style={
        {
          ...overflow,
          ...scrollbar,
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain',
          ...style,
        } as CSSProperties
      }
      {...rest}
    >
      {children}
    </Box>
  );
}

/**
 * Sticky — element that becomes `position: sticky` and pins to its
 * containing scroll context's edge. Defaults to top-pin (`top: 0`);
 * pass `bottom={0}` for a footer-style sticky.
 *
 * Sticky requires a containing scroll ancestor — wrap your
 * `<ScrollView>` (or any `overflow: auto` container) around it for
 * the effect to fire.
 */
export interface StickyProps extends BoxProps {
  /** Pin offset. Defaults to `0` (the top of the scroll container). */
  top?: number | string;
  bottom?: number | string;
  zIndex?: number;
  children?: ReactNode;
}
export function Sticky({
  top = 0,
  bottom,
  zIndex = 1,
  children,
  style,
  ...rest
}: StickyProps): ReactElement {
  return (
    <Box
      position="sticky"
      style={
        {
          top,
          ...(bottom !== undefined ? { bottom } : {}),
          zIndex,
          ...style,
        } as CSSProperties
      }
      {...rest}
    >
      {children}
    </Box>
  );
}

/**
 * VirtualList — list primitive with a virtualisation seam.
 *
 * **v0 ships a non-virtualised fallback** that renders every item.
 * The full Virtuoso (web) / FlashList (native) integration lands as
 * a follow-up — it requires a peer dep and additional plumbing to
 * keep the bundle reasonable. For tens of thousands of rows, prefer
 * the future native VirtualList; for hundreds, this fallback is
 * fine and matches the runtime characteristics of a plain map.
 *
 * The prop shape mirrors what the future virtualised version will
 * accept so callers don't need a migration when the integration
 * ships.
 */
export interface VirtualListProps<T> extends Omit<ScrollViewProps, 'children'> {
  data: readonly T[];
  /** Render fn. Called once per item; key is derived from `keyOf` or
   * the index. */
  renderItem: (item: T, index: number) => ReactNode;
  /** Stable item-id extractor. Falls back to the index. */
  keyOf?: (item: T, index: number) => string | number;
  /** Approximate row height — accepted today as documentation; the
   * future virtualised path uses this to size the viewport. */
  itemHeight?: number;
}
export function VirtualList<T>({
  data,
  renderItem,
  keyOf,
  itemHeight: _itemHeight,
  ...rest
}: VirtualListProps<T>): ReactElement {
  return (
    <ScrollView {...rest}>
      {data.map((item, i) => (
        <Box key={keyOf?.(item, i) ?? i}>{renderItem(item, i)}</Box>
      ))}
    </ScrollView>
  );
}
