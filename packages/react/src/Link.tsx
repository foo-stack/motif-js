'use client';

import type { MotifComponent } from '@usemotif/core';

import type { MouseEvent, ReactElement, ReactNode } from 'react';
import { Pressable, type PressableProps } from './Pressable.js';

export interface LinkProps extends Omit<PressableProps, 'as' | 'children'> {
  /** URL the link points at. Becomes the anchor's `href`. */
  href: string;
  /** Standard target - `'_blank'` opens in a new tab. */
  target?: '_blank' | '_self' | '_parent' | '_top';
  /** Anchor `rel` attribute. When `target='_blank'` is set, motif
   * defaults this to `'noopener noreferrer'` for security; pass an
   * explicit `rel` to override. */
  rel?: string;
  /** Visual underlining mode. `'hover'` (default) only underlines on
   * hover/focus; `'always'` underlines unconditionally; `'never'`
   * never underlines (use sparingly - accessibility). */
  underline?: 'hover' | 'always' | 'never';
  children?: ReactNode;
}

/**
 * Inline anchor primitive. Renders `<a>` and inherits Pressable's
 * pseudo-state plumbing so callers can pass `_hover` etc. for
 * additional styling.
 *
 * Defaults follow the WCAG-friendly path: link colour comes from the
 * theme's primary accent, focus ring is the same accent, hover
 * underlines (`underline='hover'`). `target='_blank'` auto-injects
 * `rel='noopener noreferrer'` unless the caller overrides.
 */
export const Link: MotifComponent<LinkProps, ReactElement | null> = function (
  props: LinkProps,
): ReactElement {
  const {
    href,
    target,
    rel,
    underline = 'hover',
    onClick,
    onPress,
    children,
    color,
    ...rest
  } = props;

  const safeRel = rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined);
  const baseUnderline = underline === 'always' ? 'underline' : 'none';
  const hoverUnderline = underline === 'never' ? undefined : 'underline';

  // We pass through both onClick (web-native) and onPress (motif
  // cross-platform alias). Pressable handles the merge.
  const handler = onPress ?? onClick;

  // PressableProps doesn't include anchor-specific attributes
  // (HTMLAttributes<HTMLElement> rather than HTMLAnchorElement);
  // bundle them in a single cast so the JSX stays clean.
  const anchorAttrs = {
    href,
    ...(target !== undefined ? { target } : {}),
    ...(safeRel !== undefined ? { rel: safeRel } : {}),
  } as Record<string, string>;

  return (
    <Pressable
      as="a"
      color={color ?? '$colors.action.primary.bg'}
      cursor="pointer"
      // Emit the base decoration as a style *prop*, not inline `style`: inline
      // styles (specificity 1,0,0,0) always beat the `_hover` class-pseudo
      // rule, so an inline `text-decoration: none` made the default hover
      // underline impossible. As a style prop it goes through the resolver and
      // `liftPseudoOverriddenBaseProps` lets the hover/focus rule win.
      textDecoration={baseUnderline}
      _hover={hoverUnderline !== undefined ? { textDecoration: hoverUnderline } : {}}
      _focus={{
        outlineStyle: 'solid',
        outlineWidth: 2,
        outlineColor: '$colors.action.primary.bg',
        // Underline on keyboard focus too (matches the documented hover/focus
        // behaviour), so focus isn't signalled by the ring alone.
        ...(hoverUnderline !== undefined ? { textDecoration: hoverUnderline } : {}),
      }}
      {...(handler !== undefined
        ? { onPress: handler as (e: MouseEvent<HTMLElement>) => void }
        : {})}
      {...anchorAttrs}
      {...rest}
    >
      {children}
    </Pressable>
  );
};
