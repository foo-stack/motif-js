import { Box, Pressable, type BoxProps, type PressableProps } from '@motif-js/react';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';

type AnchorAttrs = Pick<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'href' | 'target' | 'rel' | 'title' | 'download'
>;

type ButtonAttrs = Pick<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'type' | 'role' | 'aria-expanded' | 'aria-haspopup' | 'aria-controls'
>;

/**
 * Type-safe `<Box as="a">` wrapper. Box's typings extend
 * `HTMLAttributes<HTMLElement>`, which doesn't carry anchor-specific
 * props (`href`, `target`, etc.). This shim narrows the type so call
 * sites get proper IntelliSense without per-call casts.
 *
 * Local to the docs site — promotion to motif-js itself is a M-5+
 * decision.
 */
export function Anchor(props: BoxProps & AnchorAttrs) {
  return <Box as="a" {...(props as BoxProps)} />;
}

/**
 * Type-safe `<Pressable as="button">` wrapper that surfaces button-
 * specific HTML attributes (`type`, `role`, ARIA bag) which `Pressable`'s
 * BoxProps-derived typing omits. Same rationale as {@link Anchor}.
 */
export function Btn(props: PressableProps & ButtonAttrs) {
  return <Pressable {...(props as PressableProps)} />;
}
