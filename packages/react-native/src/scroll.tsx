import type { ReactElement, ReactNode } from 'react';
import { ScrollView as RNScrollView } from 'react-native';
import { Box, type BoxProps } from './Box.js';

/**
 * ScrollView — wraps RN's ScrollView with motif's prop schema. The
 * actual scrolling is done by RN; motif just plumbs theme-resolved
 * styles through.
 */
export interface ScrollViewProps extends BoxProps {
  direction?: 'vertical' | 'horizontal' | 'both';
  hideScrollbar?: boolean;
  children?: ReactNode;
}
export function ScrollView({
  direction = 'vertical',
  hideScrollbar = false,
  children,
  ...rest
}: ScrollViewProps): ReactElement {
  return (
    <RNScrollView
      horizontal={direction === 'horizontal'}
      showsVerticalScrollIndicator={!hideScrollbar && direction !== 'horizontal'}
      showsHorizontalScrollIndicator={!hideScrollbar && direction !== 'vertical'}
    >
      <Box {...rest}>{children}</Box>
    </RNScrollView>
  );
}

/**
 * Sticky on native — RN doesn't have CSS `position: sticky`. The
 * platform-correct approach is `stickyHeaderIndices` on
 * `<ScrollView>`, which is per-list, not per-element. To keep the
 * cross-platform API consistent in v0, native Sticky just renders
 * its children inline as a regular Box. Apps needing real native
 * sticky behaviour should use RN's `stickyHeaderIndices` directly
 * for now; we'll expose a more complete primitive in a later
 * release.
 */
export interface StickyProps extends BoxProps {
  top?: number | string;
  bottom?: number | string;
  zIndex?: number;
  children?: ReactNode;
}
export function Sticky({ children, ...rest }: StickyProps): ReactElement {
  return <Box {...rest}>{children}</Box>;
}

export interface VirtualListProps<T> extends Omit<ScrollViewProps, 'children'> {
  data: readonly T[];
  renderItem: (item: T, index: number) => ReactNode;
  keyOf?: (item: T, index: number) => string | number;
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
