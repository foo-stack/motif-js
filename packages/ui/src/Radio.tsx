'use client';

import {
  createContext,
  useContext,
  useId,
  useMemo,
  type CSSProperties,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { Box, type BoxProps } from 'usemotif';

// A RadioGroup shares its `name` (so the native radios behave as one group, with
// arrow-key navigation and single-selection for free) and an optional
// `defaultValue` for the initially-checked option. Selection stays native — a
// caller wanting controlled selection puts `checked`/`onChange` on each Radio.
interface RadioGroupContextValue {
  readonly name: string;
  readonly defaultValue: string | undefined;
}
const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

// Raw bits the motif prop schema doesn't model: strip the native radio chrome
// and keep the (checked-only) dot non-repeating. The dot is painted by the
// `_checked` rule, so an unchecked ring shows nothing inside.
const RESET: CSSProperties = {
  appearance: 'none',
  WebkitAppearance: 'none',
  margin: 0,
  backgroundRepeat: 'no-repeat',
};

// Hoisted so the bag prop is a stable reference (lint: no-new-object). On check,
// the ring fills primary and a centred white dot is painted via a radial
// gradient — both through the `:checked` / `[aria-checked]` rule the `_checked`
// prop emits, so it is pure CSS with no controlled state required.
const CHECKED = {
  bg: '$colors.action.primary.bg',
  borderColor: '$colors.action.primary.bg',
  backgroundImage: 'radial-gradient(circle at center, #fff 0 28%, transparent 30%)',
} as const;

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'style'> {
  /** Mark the control invalid (sets `aria-invalid`). */
  readonly invalid?: boolean;
  /** Inline-style escape hatch, merged over the control's own reset styles. */
  readonly style?: CSSProperties;
}

export interface RadioGroupProps {
  /** Shared `name` for the native radio group; auto-generated when omitted. */
  readonly name?: string;
  /** Value of the option checked on first render. */
  readonly defaultValue?: string;
  readonly children?: ReactNode;
}

/**
 * A themed radio button. It is a real `<input type="radio">`, so it is keyboard-
 * and form-native; the ring fill and dot are pure CSS driven by the `_checked`
 * pseudo-state. Inside a {@link RadioGroup} it inherits the shared `name`.
 *
 * ```tsx
 * <RadioGroup name="plan" defaultValue="pro">
 *   <label><Radio value="free" /> Free</label>
 *   <label><Radio value="pro" /> Pro</label>
 * </RadioGroup>
 * ```
 */
export function Radio({ invalid, style, ...rest }: RadioProps) {
  const group = useContext(RadioGroupContext);
  const mergedStyle = useMemo(
    () => (style === undefined ? RESET : { ...RESET, ...style }),
    [style],
  );
  // The group supplies the shared `name` and, when this option matches the
  // group's `defaultValue`, the initial checked state — but only as defaults:
  // anything the caller passes on the Radio itself wins.
  const groupDefaults =
    group === null
      ? {}
      : {
          name: group.name,
          ...(group.defaultValue !== undefined && rest.value === group.defaultValue
            ? { defaultChecked: true }
            : {}),
        };
  return (
    <Box
      as="input"
      width={18}
      height={18}
      borderWidth="$borderWidths.thin"
      borderColor="$colors.border.strong"
      borderRadius="$radii.full"
      bg="transparent"
      cursor="pointer"
      transition="background-color 120ms ease, border-color 120ms ease"
      _checked={CHECKED}
      style={mergedStyle}
      // `type` + group defaults + the caller's input attributes (value, checked,
      // onChange, …): Box forwards them to the underlying <input> at runtime, but
      // its element-level prop typing is for a generic HTMLElement, so cast past it.
      {...({
        type: 'radio',
        ...groupDefaults,
        ...(invalid ? { 'aria-invalid': true } : {}),
        ...rest,
      } as unknown as BoxProps)}
    />
  );
}

/**
 * Groups {@link Radio} options: supplies a shared `name` (so they behave as one
 * native group with arrow-key navigation and single-selection) and an optional
 * `defaultValue`, and lays them out in a labelled `role="radiogroup"` column.
 */
export function RadioGroup({ name, defaultValue, children }: RadioGroupProps) {
  const autoName = useId();
  const ctx = useMemo<RadioGroupContextValue>(
    () => ({ name: name ?? autoName, defaultValue }),
    [name, autoName, defaultValue],
  );
  return (
    <RadioGroupContext.Provider value={ctx}>
      <Box role="radiogroup" display="flex" flexDirection="column" gap="$space.2">
        {children}
      </Box>
    </RadioGroupContext.Provider>
  );
}
