'use client';

import type { MotifComponent } from '@usemotif/core';

import type { StyleProps, TokenScale } from '@usemotif/core';
import { type ReactElement, type ReactNode } from 'react';
import { Box } from './Box.js';
import { Pressable, type PressableProps } from './Pressable.js';
import { useTheme } from './theme-context.js';

/**
 * Visual variant. Determines how heavy/quiet the button looks.
 *
 * - `solid` — filled background, the default for primary calls-to-action.
 * - `outline` — bordered, no fill. Same border / text color as the intent.
 * - `ghost` — no fill, no border. Reads as a tap target only on hover.
 */
export type ButtonVariant = 'solid' | 'outline' | 'ghost';

/**
 * Semantic intent. Drives the color palette via the
 * `$colors.action.<intent>` token namespace.
 */
export type ButtonIntent = 'primary' | 'danger' | 'success' | 'neutral';

/**
 * Size shorthand. Sets padding / font-size / radius. The `size`-level
 * tokens come straight from the workspace's space / fontSizes / radii
 * scales (see `@usemotif/tokens`).
 */
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends Omit<PressableProps, 'children'> {
  /** Visual variant. Defaults to `'solid'`. */
  variant?: ButtonVariant;
  /** Semantic intent. Defaults to `'primary'`. */
  intent?: ButtonIntent;
  /** Size shorthand. Defaults to `'md'`. */
  size?: ButtonSize;
  /**
   * Loading state. When true, the button is non-interactive (clicks
   * suppressed, `aria-busy` set), and `loadingIcon` (or a default
   * indicator) replaces `leadingIcon`. Existing children remain in
   * the layout — labels stay readable behind the spinner — but a
   * caller can pass `loadingLabel` to swap the visible text instead.
   */
  loading?: boolean;
  /** Optional content rendered before the label. */
  leadingIcon?: ReactNode;
  /** Optional content rendered after the label. */
  trailingIcon?: ReactNode;
  /**
   * Override for the loading indicator. When omitted, a small
   * neutral indicator is rendered.
   */
  loadingIcon?: ReactNode;
  /**
   * Optional alternate label rendered while `loading` is true. Use this
   * to swap "Save" → "Saving…" without manually toggling children.
   */
  loadingLabel?: ReactNode;
  /** Stretch to fill the parent's inline-size. */
  fullWidth?: boolean;
  /** Button label. */
  children?: ReactNode;
}

/** Per-size style bag (padding / font-size / radius / icon gap). */
const sizeStyles: Record<ButtonSize, StyleProps> = {
  xs: { px: '$2', py: '$1', fontSize: '$xs', borderRadius: '$sm', gap: '$1' },
  sm: { px: '$3', py: '$1.5', fontSize: '$sm', borderRadius: '$sm', gap: '$1.5' },
  md: { px: '$4', py: '$2', fontSize: '$md', borderRadius: '$md', gap: '$2' },
  lg: { px: '$5', py: '$2.5', fontSize: '$lg', borderRadius: '$md', gap: '$2' },
  xl: { px: '$6', py: '$3', fontSize: '$xl', borderRadius: '$lg', gap: '$2.5' },
};

/** Resolved per-intent colour roles. */
interface IntentTokenBag {
  bg: string;
  fg: string;
  hover: string;
  border: string;
  /**
   * Label colour for the unfilled variants (`outline`, `ghost`), where the
   * text sits on the page rather than on `bg`. Separate from `bg` because a
   * fill and a label have different contrast obligations: `bg` doubles as ink
   * acceptably for the mid-tone intents, but a neutral fill is a near-white
   * tint that disappears when used as text.
   */
  ink: string;
}

/**
 * Per-intent token mapping. The token strings reference the workspace's
 * `$colors.action.<intent>` namespace (defined in `@usemotif/tokens`'s
 * light + dark themes), with a fallback to a literal neutral mapping for
 * themes that do not define `action.neutral`.
 */
const intentTokens: Record<ButtonIntent, IntentTokenBag> = {
  primary: {
    bg: '$colors.action.primary.bg',
    fg: '$colors.action.primary.fg',
    hover: '$colors.action.primary.hover',
    border: '$colors.action.primary.bg',
    ink: '$colors.action.primary.bg',
  },
  danger: {
    bg: '$colors.action.danger.bg',
    fg: '$colors.action.danger.fg',
    hover: '$colors.action.danger.hover',
    border: '$colors.action.danger.bg',
    ink: '$colors.action.danger.bg',
  },
  success: {
    bg: '$colors.action.success.bg',
    fg: '$colors.action.success.fg',
    hover: '$colors.action.success.hover',
    border: '$colors.action.success.bg',
    ink: '$colors.action.success.bg',
  },
  neutral: {
    bg: '$colors.action.neutral.bg',
    fg: '$colors.action.neutral.fg',
    hover: '$colors.action.neutral.hover',
    border: '$colors.action.neutral.hover',
    // The one intent whose fill is too pale to double as ink — an outline or
    // ghost neutral button reads as body text, not as a tinted accent.
    ink: '$colors.text.default',
  },
};

/**
 * Neutral built from the theme's own `gray` ramp — used when the theme has
 * no `action.neutral` but does define `gray`, which is the arrangement
 * recommended to consumers before the semantic group existed. A primitive
 * ramp cannot invert per theme, so this tier keeps a custom palette's greys
 * rather than Tailwind's; it does not make the intent theme-aware.
 */
const NEUTRAL_GRAY_FALLBACK: IntentTokenBag = {
  bg: '$colors.gray.200',
  fg: '$colors.gray.900',
  hover: '$colors.gray.300',
  border: '$colors.gray.300',
  ink: '$colors.gray.900',
};

/**
 * Last-resort literal neutral palette, for a theme that defines neither
 * `action.neutral` nor a `gray` ramp. Without it the intent would emit
 * `var(--colors-action-neutral-bg)` references that resolve to nothing in
 * the cascade. These literals are Tailwind's gray 100/200/300/900.
 *
 * Being literals, they cannot invert per theme — a dark theme that reaches
 * this tier still gets light-mode greys. `Theme` carries no light/dark
 * signal to branch on, so defining `action.neutral` is what makes the intent
 * theme-aware.
 */
const NEUTRAL_FALLBACK: IntentTokenBag = {
  bg: '#e5e7eb',
  fg: '#111827',
  hover: '#d1d5db',
  border: '#d1d5db',
  ink: '#111827',
};

/** Ghost-variant hover tint used when the theme defines no usable surface. */
const GHOST_HOVER_FALLBACK = '#f3f4f6';

/**
 * True when `colors.<group>.<key>` exists. Hand-narrowed because `TokenScale`
 * is recursive: `colors.action` is a `TokenNode`, which may be a leaf string
 * rather than a nested group.
 *
 * Presence is tested structurally rather than by attempting a resolve, so the
 * graceful-degrade path stays quiet — resolving a deliberately-absent token
 * would trip the unresolved-reference warning on every render.
 */
function hasGroupEntry(
  colors: TokenScale<string> | undefined,
  group: string,
  key: string,
): boolean {
  const node = colors?.[group];
  return typeof node === 'object' && node !== null && node[key] !== undefined;
}

/**
 * Pick the neutral palette the active theme can actually render, preferring
 * the semantic group (the only tier that inverts between light and dark) and
 * degrading to the theme's own `gray` ramp, then to literals.
 */
function neutralBagFor(colors: TokenScale<string> | undefined): IntentTokenBag {
  if (hasGroupEntry(colors, 'action', 'neutral')) return intentTokens.neutral;
  if (colors?.gray !== undefined) return NEUTRAL_GRAY_FALLBACK;
  return NEUTRAL_FALLBACK;
}

/**
 * Compose the per-(variant × intent) style bag. Variants vary in which
 * tokens land on background / color / border:
 *
 * - solid: bg = intent.bg, fg = intent.fg, hover bg = intent.hover.
 * - outline: bg = transparent, label = intent.ink, border = intent.bg,
 *   hover bg = intent.bg + low alpha (approximated via a tinted hover
 *   token).
 * - ghost: bg = transparent, label = intent.ink, no border, hover =
 *   neutral tint.
 *
 * The unfilled variants take their label from `ink` rather than `bg`: `bg`
 * is a fill, and only the mid-tone intents happen to survive being used as
 * text as well.
 */
function variantStylesFor(variant: ButtonVariant, t: IntentTokenBag): StyleProps {
  if (variant === 'solid') {
    return {
      bg: t.bg,
      color: t.fg,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: t.border,
    };
  }
  if (variant === 'outline') {
    return {
      bg: 'transparent',
      color: t.ink,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: t.bg,
    };
  }
  return {
    bg: 'transparent',
    color: t.ink,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'transparent',
  };
}

/** Pseudo-state hover style per (variant × intent). */
function hoverFor(variant: ButtonVariant, t: IntentTokenBag, ghostHoverBg: string): StyleProps {
  if (variant === 'solid') return { bg: t.hover, borderColor: t.hover };
  if (variant === 'outline') return { bg: t.hover, color: t.fg, borderColor: t.hover };
  return { bg: ghostHoverBg };
}

/** Default loading indicator — a small neutral dot stack. Animation-free
 * by design (motion belongs to a peer animation lib, not this package);
 * callers wanting a spinner pass `loadingIcon`. */
function DefaultLoadingIndicator(): ReactElement {
  return (
    <Box
      as="span"
      aria-hidden="true"
      display="inline-flex"
      alignItems="center"
      gap={2}
      style={{ letterSpacing: '0.1em' }}
    >
      <Box as="span" w={4} h={4} borderRadius="$full" bg="currentColor" opacity={0.85} />
      <Box as="span" w={4} h={4} borderRadius="$full" bg="currentColor" opacity={0.55} />
      <Box as="span" w={4} h={4} borderRadius="$full" bg="currentColor" opacity={0.25} />
    </Box>
  );
}

/**
 * The flagship interactive primitive: a labelled button with a variant
 * matrix (visual × intent × size), full pseudo-state styling
 * (hover / focus-visible / active / disabled), composition slots
 * (leadingIcon / trailingIcon), and a loading state that disables
 * interaction + sets `aria-busy`.
 *
 * Composes `<Pressable>` for the underlying a11y + state plumbing —
 * inherits `<button type="button">` defaults, `aria-disabled`,
 * focus-visible, `:disabled` selectors. Style props from the user
 * always override the variant-derived defaults.
 *
 * @example
 * ```tsx
 * <Button onPress={save} loading={pending}>Save</Button>
 * <Button variant="outline" intent="danger" size="sm" leadingIcon={<TrashIcon />}>
 *   Delete
 * </Button>
 * ```
 */
export const Button: MotifComponent<ButtonProps, ReactElement | null> = function (
  props: ButtonProps,
): ReactElement {
  const {
    variant = 'solid',
    intent = 'primary',
    size = 'md',
    loading = false,
    leadingIcon,
    trailingIcon,
    loadingIcon,
    loadingLabel,
    fullWidth = false,
    disabled,
    children,
    onPress,
    onClick,
    ...rest
  } = props;

  // Resolve the intent palette against the active theme. `neutral` reads from
  // `action.neutral` and the ghost hover from `surface.interactive` — both
  // semantic, so both invert per theme — but only @usemotif/tokens guarantees
  // them, so each degrades when a hand-authored theme omits it.
  const theme = useTheme();
  const colors = theme?.tokens?.colors;
  const intentBag: IntentTokenBag =
    intent === 'neutral' ? neutralBagFor(colors) : intentTokens[intent];
  const ghostHoverBg = hasGroupEntry(colors, 'surface', 'interactive')
    ? '$colors.surface.interactive'
    : colors?.gray !== undefined
      ? '$colors.gray.100'
      : GHOST_HOVER_FALLBACK;

  const sizeBag = sizeStyles[size];
  const variantBag = variantStylesFor(variant, intentBag);
  const hoverBag = hoverFor(variant, intentBag, ghostHoverBg);

  const widthBag: StyleProps = fullWidth ? { width: '$full' } : {};
  const isDisabled = disabled === true || loading;

  // Loading mutes the click handler at the Button level so the
  // Pressable underneath never sees the activation. We also surface
  // the busy state to assistive tech.
  const handler = isDisabled ? undefined : (onPress ?? onClick);

  const indicator = loading ? (loadingIcon ?? <DefaultLoadingIndicator />) : leadingIcon;
  const label = loading && loadingLabel !== undefined ? loadingLabel : children;

  return (
    <Pressable
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      fontWeight="$semibold"
      cursor={isDisabled ? 'not-allowed' : 'pointer'}
      {...sizeBag}
      {...variantBag}
      {...widthBag}
      {...(isDisabled ? { disabled: true } : {})}
      {...(loading ? { 'aria-busy': true } : {})}
      _hover={hoverBag}
      _focus={{ outlineStyle: 'solid', outlineWidth: 2, outlineColor: intentBag.bg }}
      _active={{ opacity: 0.85 }}
      _disabled={{ opacity: 0.5, cursor: 'not-allowed' }}
      {...(handler !== undefined ? { onPress: handler } : {})}
      {...rest}
    >
      {indicator !== undefined && indicator !== null ? (
        <Box as="span" display="inline-flex" alignItems="center" aria-hidden={loading}>
          {indicator}
        </Box>
      ) : null}
      {label}
      {trailingIcon !== undefined && trailingIcon !== null ? (
        <Box as="span" display="inline-flex" alignItems="center">
          {trailingIcon}
        </Box>
      ) : null}
    </Pressable>
  );
};
