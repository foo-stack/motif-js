import { Children, type ReactNode } from 'react';
import { Box, type BoxProps } from './Box.js';
import { StaggerContext } from './_stagger-context.js';

export interface StackProps extends Omit<BoxProps, 'flexDirection'> {
  /**
   * Stack direction. Defaults to `'column'` for `Stack` / `VStack`,
   * `'row'` for `HStack`. Mirrors the web renderer's API.
   */
  direction?: BoxProps['flexDirection'];
  /**
   * Stagger entry-animation delay between direct children, in seconds.
   * Each direct child gets `index * stagger` added to its driver-side
   * `delayMs`, so children with `enterStyle` mount in a wave instead
   * of all-at-once. Composes with each child's own `transition` delay.
   *
   * Native reduced-motion handling stays consumer-side in v1: branch
   * on `useReducedMotion()` from `@usemotif/headless` and pass `0`
   * when reduced motion is on.
   *
   * @example
   * ```tsx
   * <Stack stagger={0.05}>
   *   {items.map((item) => (
   *     <Box key={item.id} enterStyle={{ opacity: 0 }}>{item.label}</Box>
   *   ))}
   * </Stack>
   * ```
   */
  stagger?: number;
}

/**
 * A flexbox container that stacks its children with consistent
 * spacing. Defaults to column-based; pass `direction="row"` (or use
 * `HStack`) for horizontal layouts. The `gap` style prop controls
 * spacing between items via RN's `gap` style — works the same with
 * column and row direction.
 *
 * Set `stagger` to orchestrate a per-child delay on entry animations.
 *
 * @example
 *
 * ```tsx
 * <Stack gap="$4" alignItems="center">
 *   <Text>Title</Text>
 *   <Text>Body</Text>
 * </Stack>
 * ```
 */
export function Stack({ direction = 'column', stagger, children, ...rest }: StackProps) {
  const wrapped = wrapForStagger(children, stagger);
  return (
    <Box display="flex" flexDirection={direction} {...rest}>
      {wrapped}
    </Box>
  );
}

function wrapForStagger(children: ReactNode, stagger: number | undefined): ReactNode {
  if (stagger === undefined || stagger === 0) return children;
  return Children.map(children, (child, i) => (
    <StaggerContext.Provider value={i * stagger}>{child}</StaggerContext.Provider>
  ));
}

/** Horizontal stack — `<Stack direction="row">` shorthand. */
export function HStack(props: Omit<StackProps, 'direction'>) {
  return <Stack direction="row" {...props} />;
}

/** Vertical stack — `<Stack direction="column">` shorthand. The default. */
export function VStack(props: Omit<StackProps, 'direction'>) {
  return <Stack direction="column" {...props} />;
}
