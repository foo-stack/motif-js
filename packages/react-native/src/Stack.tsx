import { Box, type BoxProps } from './Box.js';

export interface StackProps extends Omit<BoxProps, 'flexDirection'> {
  /**
   * Stack direction. Defaults to `'column'` for `Stack` / `VStack`,
   * `'row'` for `HStack`. Mirrors the web renderer's API.
   */
  direction?: BoxProps['flexDirection'];
}

/**
 * A flexbox container that stacks its children with consistent
 * spacing. Defaults to column-based; pass `direction="row"` (or use
 * `HStack`) for horizontal layouts. The `gap` style prop controls
 * spacing between items via RN's `gap` style — works the same with
 * column and row direction.
 *
 * Web parity: same prop schema and behavior as
 * `@motif-js/react`'s `Stack`.
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
export function Stack({ direction = 'column', ...rest }: StackProps) {
  return <Box display="flex" flexDirection={direction} {...rest} />;
}

/** Horizontal stack — `<Stack direction="row">` shorthand. */
export function HStack(props: Omit<StackProps, 'direction'>) {
  return <Stack direction="row" {...props} />;
}

/** Vertical stack — `<Stack direction="column">` shorthand. The default. */
export function VStack(props: Omit<StackProps, 'direction'>) {
  return <Stack direction="column" {...props} />;
}
