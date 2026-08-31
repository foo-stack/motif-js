'use client';

import { useMemo, type CSSProperties, type InputHTMLAttributes } from 'react';
import { Box, type BoxProps } from 'usemotif';

// Raw bits the motif prop schema doesn't model (and that the `_checked` rule
// never overrides): reset the native checkbox chrome and paint the thumb as a
// small, non-repeating background circle whose POSITION the motif props move.
const RESET: CSSProperties = {
  appearance: 'none',
  WebkitAppearance: 'none',
  margin: 0,
  backgroundImage: 'radial-gradient(circle at center, #fff 0 45%, transparent 47%)',
  backgroundRepeat: 'no-repeat',
  backgroundSize: '18px 18px',
};

// Hoisted so the bag prop is a stable reference (lint: no-new-object). On check,
// the track turns primary and the thumb slides to the right edge - both via the
// `:checked` / `[aria-checked]` rule the `_checked` prop emits, so it's pure CSS
// with no controlled state required.
const CHECKED = {
  bg: '$colors.action.primary.bg',
  backgroundPosition: 'right 3px center',
} as const;

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'style'> {
  /** Mark the control invalid (sets `aria-invalid`). */
  readonly invalid?: boolean;
  /** Inline-style escape hatch, merged over the control's own reset styles. */
  readonly style?: CSSProperties;
}

/**
 * A themed toggle switch. It is a real `<input type="checkbox" role="switch">`,
 * so it is keyboard- and form-native; the track and sliding thumb are pure CSS
 * driven by the `_checked` pseudo-state (`:checked` / `[aria-checked]`), with no
 * controlled state required.
 *
 * ```tsx
 * <Switch defaultChecked onChange={(e) => save(e.currentTarget.checked)} />
 * ```
 */
export function Switch({ invalid, style, ...rest }: SwitchProps) {
  const mergedStyle = useMemo(
    () => (style === undefined ? RESET : { ...RESET, ...style }),
    [style],
  );
  return (
    <Box
      as="input"
      width={44}
      height={24}
      borderWidth={0}
      borderRadius="$radii.full"
      bg="$colors.border.strong"
      backgroundPosition="left 3px center"
      cursor="pointer"
      transition="background-color 150ms ease, background-position 150ms ease"
      _checked={CHECKED}
      style={mergedStyle}
      // `type` / `role` + the caller's input attributes (checked, onChange, ...):
      // Box forwards them to the underlying <input> at runtime, but its
      // element-level prop typing is for a generic HTMLElement, so cast past it.
      {...({
        type: 'checkbox',
        role: 'switch',
        ...(invalid ? { 'aria-invalid': true } : {}),
        ...rest,
      } as unknown as BoxProps)}
    />
  );
}
