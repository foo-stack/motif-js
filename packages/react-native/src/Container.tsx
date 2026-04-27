import { useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import type { LayoutChangeEvent, ViewStyle } from 'react-native';
import { Box, type BoxProps } from './Box.js';
import { ContainerContext, type ContainerContextValue } from './container-context.js';

export interface ContainerProps extends Omit<BoxProps, 'children' | 'onLayout'> {
  /**
   * Container name. Descendants address this container with
   * `@<name>.<bp>` keys (e.g. `p={{ '@card.md': '$4' }}`). When
   * omitted, descendants can still target the nearest container with
   * `@<bp>` keys.
   */
  name?: string;
  /**
   * Re-measure rate cap (in milliseconds). Suppresses container-width
   * updates that arrive faster than this; useful on devices where
   * `onLayout` fires multiple times during animation. Set to `0` to
   * disable. Default: `16` (one frame at 60fps).
   */
  rateCapMs?: number;
  children?: ReactNode;
}

/**
 * Native container-query polyfill. Wraps a `Box` and tracks its own
 * width via `View.onLayout`, exposes the width (and any name) via
 * React context. Descendants' `@<bp>` and `@<name>.<bp>` responsive
 * keys resolve against the matching container's width.
 *
 * @example
 *
 * ```tsx
 * <Container name="card">
 *   <Box p={{ base: '$2', '@card.md': '$4' }}>
 *     {/* reflows when the Container's width crosses 768px,
 *         independent of the device viewport *\/}
 *   </Box>
 * </Container>
 * ```
 *
 * **Performance:** the polyfill rate-caps `onLayout` updates at one
 * frame per default (16ms). Heavily-animated containers can opt out
 * via `rateCapMs={0}`; static containers can crank it up to
 * `rateCapMs={50}` to skip transient layout passes.
 */
export function Container({ name, rateCapMs = 16, children, ...rest }: ContainerProps) {
  const [width, setWidth] = useState<number | null>(null);
  const parent = useContext(ContainerContext);
  const lastUpdateRef = useRef(0);

  const onLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (rateCapMs > 0) {
      const now = Date.now();
      if (now - lastUpdateRef.current < rateCapMs) return;
      lastUpdateRef.current = now;
    }
    setWidth(w);
  };

  const value = useMemo<ContainerContextValue>(() => {
    if (width === null) return parent;
    const named = name === undefined ? parent.named : new Map(parent.named).set(name, width);
    return { nearestWidth: width, named };
  }, [name, width, parent]);

  // Box accepts non-style props (onLayout) via its View pass-through.
  // The cast is because Box's strict prop union doesn't include
  // RN-specific event handlers explicitly.
  return (
    <Box {...rest} {...({ onLayout } as { onLayout: (e: LayoutChangeEvent) => void })}>
      <ContainerContext.Provider value={value}>{children}</ContainerContext.Provider>
    </Box>
  );
}

// Style type re-export for parity with the web Container's API
// surface (consumers can import `ContainerStyle` if they need an
// explicit override type for the wrapper view's `style` prop).
export type ContainerStyle = ViewStyle;
