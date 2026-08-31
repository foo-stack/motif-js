'use client';

import { useMemo, type CSSProperties, type InputHTMLAttributes } from 'react';
import { Box, type BoxProps } from 'usemotif';

// Raw bits the motif prop schema doesn't model: strip the native checkbox chrome
// and keep the (checked-only) tick image centred and non-repeating. The tick
// itself is painted by the `_checked` rule, so an unchecked box shows nothing.
const RESET: CSSProperties = {
  appearance: 'none',
  WebkitAppearance: 'none',
  margin: 0,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: '100% 100%',
};

// Hoisted so the bag prop is a stable reference (lint: no-new-object). On check,
// the box fills with the primary colour and a white tick is painted in - both
// via the `:checked` / `[aria-checked]` rule the `_checked` prop emits, so it is
// pure CSS with no controlled state required. The tick is an inline SVG data URI
// (white stroke, `%23fff`); a non-token string value passes through verbatim.
const CHECKED = {
  bg: '$colors.action.primary.bg',
  borderColor: '$colors.action.primary.bg',
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='none' stroke='%23fff' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round' d='M3.5 8.5l3 3 6-7'/%3E%3C/svg%3E\")",
} as const;

export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'style'
> {
  /** Mark the control invalid (sets `aria-invalid`). */
  readonly invalid?: boolean;
  /** Inline-style escape hatch, merged over the control's own reset styles. */
  readonly style?: CSSProperties;
}

/**
 * A themed checkbox. It is a real `<input type="checkbox">`, so it is keyboard-
 * and form-native; the fill and tick are pure CSS driven by the `_checked`
 * pseudo-state (`:checked` / `[aria-checked]`), with no controlled state
 * required.
 *
 * ```tsx
 * <Checkbox defaultChecked onChange={(e) => setAgreed(e.currentTarget.checked)} />
 * ```
 */
export function Checkbox({ invalid, style, ...rest }: CheckboxProps) {
  const mergedStyle = useMemo(
    () => (style === undefined ? RESET : { ...RESET, ...style }),
    [style],
  );
  return (
    <Box
      as="input"
      width={18}
      height={18}
      borderWidth="$borderWidths.thin"
      borderColor="$colors.border.strong"
      borderRadius="$radii.sm"
      bg="transparent"
      cursor="pointer"
      transition="background-color 120ms ease, border-color 120ms ease"
      _checked={CHECKED}
      style={mergedStyle}
      // `type` + the caller's input attributes (checked, onChange, ...): Box
      // forwards them to the underlying <input> at runtime, but its element-level
      // prop typing is for a generic HTMLElement, so cast past it.
      {...({
        type: 'checkbox',
        ...(invalid ? { 'aria-invalid': true } : {}),
        ...rest,
      } as unknown as BoxProps)}
    />
  );
}
