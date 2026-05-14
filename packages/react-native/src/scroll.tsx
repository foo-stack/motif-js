import { Children, isValidElement, type ReactElement, type ReactNode } from 'react';
import { ScrollView as RNScrollView } from 'react-native';
import { Box, useResolvedBoxStyle, type BoxProps } from './Box.js';

/**
 * ScrollView — wraps RN's ScrollView with motif's prop schema. Box-
 * level style props resolve into RN's `contentContainerStyle` so the
 * scrollable region is styled directly without an extra View wrapper;
 * children are direct children of the RN ScrollView so any `<Sticky>`
 * descendants surface as `stickyHeaderIndices` for free.
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
  style: userStyle,
  ...rest
}: ScrollViewProps): ReactElement {
  const { style: contentStyle, passThrough } = useResolvedBoxStyle(rest, userStyle);
  const stickyIndices = collectStickyIndices(children);

  return (
    <RNScrollView
      {...(passThrough as Record<string, unknown>)}
      horizontal={direction === 'horizontal'}
      showsVerticalScrollIndicator={!hideScrollbar && direction !== 'horizontal'}
      showsHorizontalScrollIndicator={!hideScrollbar && direction !== 'vertical'}
      contentContainerStyle={contentStyle}
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
