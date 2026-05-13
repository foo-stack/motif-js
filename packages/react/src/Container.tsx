import type { CSSProperties } from 'react';
import { Box, type BoxProps } from './Box.js';

export interface ContainerProps extends BoxProps {
  /**
   * Container name. Descendants address this container with
   * `@<name>.<bp>` keys (e.g. `p={{ '@card.md': '$4' }}`). When omitted,
   * descendants can still target the nearest container with `@<bp>` keys.
   */
  name?: string;
  /**
   * CSS `container-type`. Defaults to `'inline-size'` — the most common
   * choice and the only one that allows querying inline (width) without
   * laying out children. Pass `'size'` to query both axes (more expensive)
   * or `'normal'` to opt out of containment entirely.
   */
  type?: 'inline-size' | 'size' | 'normal';
}

/**
 * Establishes a containment context so descendants can target it with
 * container-query responsive keys (`@<bp>` or `@<name>.<bp>`).
 *
 * @example
 *
 * ```tsx
 * <Container name="card">
 *   <Box p={{ base: '$2', '@card.md': '$4', '@card.lg': '$8' }}>
 *     Reflows on container width, not viewport width.
 *   </Box>
 * </Container>
 * ```
 */
export function Container({ name, type = 'inline-size', style, ...rest }: ContainerProps) {
  const containerStyle: CSSProperties = { containerType: type, ...style };
  if (name !== undefined) containerStyle.containerName = name;

  return <Box {...rest} style={containerStyle} />;
}
