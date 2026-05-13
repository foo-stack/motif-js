'use client';

import type { ReactElement, ReactNode } from 'react';
import { Box, type BoxProps } from './Box.js';

/**
 * Z-axis stack — children share the same grid cell so they overlap
 * along the z-axis. Use for badge overlays, image-with-caption, or
 * any "everything stacks here" composition.
 *
 * Implementation: `display: grid; grid-template-areas: 'stack'`
 * (single cell), every child auto-assigned to that cell. Sizing
 * comes from the largest child unless an explicit `width` / `height`
 * is set on ZStack itself. Source order = stacking order
 * (last child paints on top), matching React + DOM expectations.
 */
export interface ZStackProps extends BoxProps {
  children?: ReactNode;
}
export function ZStack({ children, ...rest }: ZStackProps): ReactElement {
  return (
    <Box display="grid" style={{ gridTemplateAreas: '"stack"' }} {...rest}>
      {wrapChildrenInStackCell(children)}
    </Box>
  );
}

function wrapChildrenInStackCell(children: ReactNode): ReactNode {
  // Each child gets `gridArea: 'stack'` via a Box wrapper — keeps
  // children unaware of the stacking mechanism while letting them
  // share a single cell. We don't introspect the child to apply the
  // style directly; a lightweight wrapper is simpler and safer.
  return <>{wrapEach(children)}</>;
}

function wrapEach(children: ReactNode): ReactNode[] {
  if (children === null || children === undefined) return [];
  const out: ReactNode[] = [];
  const arr = Array.isArray(children) ? children : [children];
  let i = 0;
  for (const c of arr) {
    if (c === null || c === undefined || c === false) continue;
    out.push(
      <Box key={i} style={{ gridArea: 'stack' }} display="contents">
        {c}
      </Box>,
    );
    i += 1;
  }
  return out;
}

/**
 * Spacer — consumes the available main-axis space inside a flex
 * container. Equivalent to `<Box flex={1}>` but reads more clearly
 * at call sites: `<HStack><A /><Spacer /><B /></HStack>`.
 */
export interface SpacerProps extends BoxProps {}
export function Spacer(props: SpacerProps): ReactElement {
  return <Box flex={1} {...props} />;
}

/**
 * Center — flex container that centers its children on both axes.
 * Reads cleaner than the `<Box display="flex" alignItems="center"
 * justifyContent="center">` long-form.
 */
export interface CenterProps extends BoxProps {
  children?: ReactNode;
}
export function Center({ children, ...rest }: CenterProps): ReactElement {
  return (
    <Box display="flex" alignItems="center" justifyContent="center" {...rest}>
      {children}
    </Box>
  );
}

/**
 * Wrap — flex container with `flex-wrap: wrap`, intended for tag
 * lists / chip rows / responsive grids of pill items where the gap
 * is consistent and the wrap point is the container edge.
 */
export interface WrapProps extends Omit<BoxProps, 'flexWrap'> {
  children?: ReactNode;
}
export function Wrap({ children, ...rest }: WrapProps): ReactElement {
  return (
    <Box display="flex" flexWrap="wrap" {...rest}>
      {children}
    </Box>
  );
}

/**
 * AspectRatio — wraps a child in a container that preserves a fixed
 * width:height ratio. Pass the ratio as `ratio={16/9}` (or any
 * positive number).
 */
export interface AspectRatioProps extends Omit<BoxProps, 'aspectRatio'> {
  /** width / height. Defaults to 1 (square). */
  ratio?: number;
  children?: ReactNode;
}
export function AspectRatio({ ratio = 1, children, ...rest }: AspectRatioProps): ReactElement {
  return (
    <Box style={{ aspectRatio: ratio }} {...rest}>
      {children}
    </Box>
  );
}

/**
 * Grid — CSS Grid container. Pass `columns` for a quick uniform
 * column count, or `templateColumns` / `templateRows` for explicit
 * track lists. Uses the gap style prop normally.
 */
export interface GridProps extends BoxProps {
  /** Shorthand for `gridTemplateColumns: 'repeat(<n>, 1fr)'`. */
  columns?: number;
  /** Raw `grid-template-columns`. Wins over `columns` when both set. */
  templateColumns?: string;
  /** Raw `grid-template-rows`. */
  templateRows?: string;
  children?: ReactNode;
}
export function Grid({
  columns,
  templateColumns,
  templateRows,
  children,
  style,
  ...rest
}: GridProps): ReactElement {
  const gridStyle: { gridTemplateColumns?: string; gridTemplateRows?: string } = {};
  if (templateColumns !== undefined) {
    gridStyle.gridTemplateColumns = templateColumns;
  } else if (columns !== undefined) {
    gridStyle.gridTemplateColumns = `repeat(${columns}, 1fr)`;
  }
  if (templateRows !== undefined) gridStyle.gridTemplateRows = templateRows;
  return (
    <Box display="grid" style={{ ...gridStyle, ...style }} {...rest}>
      {children}
    </Box>
  );
}

/**
 * Flex — bare `<Box display="flex">` with optional `direction` prop.
 * Distinct from Stack: Flex has no opinion on `gap` defaults, so use
 * it when you need a flex container without any spacing helpers.
 */
export interface FlexProps extends BoxProps {
  direction?: BoxProps['flexDirection'];
  children?: ReactNode;
}
export function Flex({ direction, children, ...rest }: FlexProps): ReactElement {
  return (
    <Box
      display="flex"
      {...(direction !== undefined ? { flexDirection: direction } : {})}
      {...rest}
    >
      {children}
    </Box>
  );
}

/**
 * SafeArea — on web, a no-op Box (safe-area concerns are device-shell
 * problems, not browser problems). Native ships its own implementation
 * in `@motif-js/react-native` that wraps RN's `SafeAreaView`. Both
 * accept the same prop set so cross-platform code stays portable.
 */
export interface SafeAreaProps extends BoxProps {
  children?: ReactNode;
}
export function SafeArea({ children, ...rest }: SafeAreaProps): ReactElement {
  return <Box {...rest}>{children}</Box>;
}
