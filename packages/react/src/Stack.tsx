import { Box, type BoxProps } from './Box.js';

export interface StackProps extends Omit<BoxProps, 'display' | 'flexDirection'> {
  /**
   * Stack direction. Defaults to `'column'` for `Stack` and `VStack`,
   * `'row'` for `HStack`.
   */
  direction?: BoxProps['flexDirection'];
}

/**
 * A flexbox container that stacks its children with consistent spacing.
 *
 * `Stack` is column-based by default; use `direction="row"` (or the `HStack`
 * shorthand) for horizontal layouts. The `gap` style prop controls spacing
 * between items via the CSS `gap` property — works the same with column
 * and row direction, no need for hacks like negative margins.
 *
 * @example
 *
 * ```tsx
 * <Stack gap="$4" alignItems="center">
 *   <Heading>Title</Heading>
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
