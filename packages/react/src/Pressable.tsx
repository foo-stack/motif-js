'use client';

import type { MotifComponent } from '@usemotif/core';

import type { ReactElement, MouseEvent, MouseEventHandler } from 'react';
import { Box, type BoxProps } from './Box.js';

export interface PressableProps extends BoxProps {
  /**
   * Cross-platform alias for `onClick`. On web, fires when the user
   * activates the button (mouse, keyboard, or touch). The native
   * implementation will use `react-native`'s `Pressable.onPress`.
   *
   * Suppressed when `disabled` is true.
   */
  onPress?: (event: MouseEvent<HTMLElement>) => void;
  /** Disables interaction. Sets both the native `disabled` attribute (on
   * `<button>`) and `aria-disabled="true"` (so non-button surfaces work
   * with the same prop). Disabled-state styling lives in `_disabled`. */
  disabled?: boolean;
  /**
   * The native `type` when rendering as a `<button>`. Defaults to
   * `'button'` so a Pressable inside a `<form>` does not submit it. Pass
   * `'submit'` for a real submit control. Ignored when `as` is not a button.
   */
  type?: 'button' | 'submit' | 'reset';
}

/**
 * A pressable surface — interactive Box with hover / focus / active /
 * disabled state styling. Defaults to rendering as `<button>`; override
 * via `as` (e.g. `as="a"` for links).
 *
 * Pseudo-state props (`_hover`, `_focus`, `_active`, `_disabled`) are
 * inherited from {@link BoxProps} — Box's resolver emits the underlying
 * CSS rules, so behaviour is identical whether the props are set on
 * `<Pressable>` or any other styled primitive.
 *
 * Pressable's own job is the interactive contract:
 * `<button>` defaults, `cursor`, `aria-disabled` mirroring of `disabled`,
 * and click suppression while disabled.
 *
 * @example
 *
 * ```tsx
 * <Pressable
 *   onPress={() => save()}
 *   bg="$colors.action.primary.bg"
 *   color="$colors.action.primary.fg"
 *   px="$4"
 *   py="$2"
 *   borderRadius="$md"
 *   _hover={{ opacity: 0.9 }}
 *   _active={{ opacity: 0.8 }}
 *   _focus={{ outlineStyle: 'solid', outlineWidth: 2 }}
 *   _disabled={{ opacity: 0.5, cursor: 'not-allowed' }}
 * >
 *   Save
 * </Pressable>
 * ```
 */
export const Pressable: MotifComponent<PressableProps, ReactElement | null> = function (
  props: PressableProps,
) {
  const { onPress, onClick, disabled, as, cursor, type, ...rest } = props;

  const handler = onPress ?? onClick;
  // Attach a click handler whenever there's a user callback OR the surface is
  // disabled. The disabled branch must `preventDefault()` — not just skip the
  // JS handler — so a disabled non-button surface (e.g. `<Link disabled>`,
  // which renders a real `<a href>`) doesn't still perform the browser's
  // default navigation. `<button disabled>` suppresses activation natively,
  // but `aria-disabled` anchors/divs do not.
  const handleClick: MouseEventHandler<HTMLElement> | undefined =
    handler !== undefined || disabled === true
      ? (event: MouseEvent<HTMLElement>) => {
          if (disabled === true) {
            event.preventDefault();
            return;
          }
          handler?.(event);
        }
      : undefined;

  // The native `<button disabled>` covers `:disabled` automatically; for
  // non-button surfaces, `aria-disabled="true"` covers the selector list.
  // Always set ARIA so the disabled visuals work regardless of `as`.
  const isButton = as === undefined || as === 'button';

  return (
    <Box
      as={as ?? 'button'}
      cursor={cursor ?? (disabled === true ? 'not-allowed' : 'pointer')}
      {...(isButton ? { type: type ?? 'button' } : {})}
      {...(handleClick !== undefined ? { onClick: handleClick } : {})}
      {...(disabled === true && isButton ? { disabled: true } : {})}
      {...(disabled === true ? { 'aria-disabled': true } : {})}
      {...(rest as BoxProps)}
    />
  );
};
