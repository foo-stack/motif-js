import { resolveStylesToVars, type StyleProps } from '@motif-js/core';
import type { MouseEvent, MouseEventHandler } from 'react';
import { Box, type BoxProps } from './Box.js';
import { injectPseudoRules, type PseudoRule } from './style-cache.js';

/**
 * Style bag for a pseudo-state. Same prop shape as Box style props but
 * **flat** — no responsive object/array/DSL nesting in v1. (Responsive +
 * pseudo composition will require nesting at-rules under the pseudo
 * selector; that's planned but not in scope for the first cut.)
 */
type StateStyleBag = {
  -readonly [K in keyof StyleProps]?: NonNullable<StyleProps[K]>;
};

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
  /** Hover-state style overrides. Applied via `:hover`. */
  _hover?: StateStyleBag;
  /** Keyboard-focus style overrides. Applied via `:focus-visible` (so
   * mouse-click focus doesn't show the focus ring). */
  _focus?: StateStyleBag;
  /** Pressed-state style overrides. Applied via `:active`. */
  _active?: StateStyleBag;
  /** Disabled-state style overrides. Applied via
   * `:disabled, [aria-disabled="true"]` so it works regardless of
   * underlying element type. */
  _disabled?: StateStyleBag;
}

/**
 * A pressable surface — interactive Box with hover / focus / active /
 * disabled state styling. Defaults to rendering as `<button>`; override
 * via `as` (e.g. `as="a"` for links).
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
export function Pressable(props: PressableProps) {
  const {
    onPress,
    onClick,
    disabled,
    _hover,
    _focus,
    _active,
    _disabled,
    as,
    cursor,
    className: userClassName,
    ...rest
  } = props;

  const pseudoRules: PseudoRule[] = [];
  if (_hover !== undefined) {
    pseudoRules.push({
      pseudo: ':hover',
      style: resolveStylesToVars(_hover as Record<string, unknown>).style,
    });
  }
  if (_focus !== undefined) {
    pseudoRules.push({
      pseudo: ':focus-visible',
      style: resolveStylesToVars(_focus as Record<string, unknown>).style,
    });
  }
  if (_active !== undefined) {
    pseudoRules.push({
      pseudo: ':active',
      style: resolveStylesToVars(_active as Record<string, unknown>).style,
    });
  }
  if (_disabled !== undefined) {
    pseudoRules.push({
      pseudo: ':disabled, &[aria-disabled="true"]',
      style: resolveStylesToVars(_disabled as Record<string, unknown>).style,
    });
  }

  const pseudoClass = injectPseudoRules(pseudoRules);
  const finalClassName = [pseudoClass, userClassName].filter(Boolean).join(' ');

  const handler = onPress ?? onClick;
  const handleClick: MouseEventHandler<HTMLElement> | undefined = handler
    ? (event: MouseEvent<HTMLElement>) => {
        if (disabled === true) return;
        handler(event);
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
      {...(handleClick !== undefined ? { onClick: handleClick } : {})}
      {...(disabled === true && isButton ? { disabled: true } : {})}
      {...(disabled === true ? { 'aria-disabled': true } : {})}
      {...(finalClassName.length > 0 ? { className: finalClassName } : {})}
      {...(rest as BoxProps)}
    />
  );
}
