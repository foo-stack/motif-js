'use client';

import type { MotifComponent } from '@usemotif/core';

import type { StyleProps, TokenScale } from '@usemotif/core';
import { type ReactElement, type ReactNode } from 'react';
import { Box } from './Box.js';
import { Pressable, type PressableProps } from './Pressable.js';
import { useTheme } from './theme-context.js';

/**
 * Resolved per-intent colour roles. `ink` is the label colour for the
 * unfilled variants, where the glyph sits on the page rather than on `bg` —
 * a fill and a label have different contrast obligations, and a neutral fill
 * is a near-white tint that disappears when used as ink.
 */
type IntentTokenBag = { bg: string; fg: string; hover: string; ink: string };

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

export type IconButtonVariant = 'solid' | 'outline' | 'ghost';
export type IconButtonIntent = 'primary' | 'danger' | 'success' | 'neutral';
export type IconButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface IconButtonProps extends Omit<PressableProps, 'children'> {
  /**
   * Required label for assistive technology. The icon itself is
   * `aria-hidden` since its meaning lives in this label.
   */
  'aria-label': string;
  variant?: IconButtonVariant;
  intent?: IconButtonIntent;
  size?: IconButtonSize;
  loading?: boolean;
  /** The icon to render. Pass either as the `icon` prop or as the
   * single child. */
  icon?: ReactNode;
  children?: ReactNode;
}

/** Square dimensions per size token. Identical font-size scale to
 * Button so an IconButton placed next to a same-sized Button looks
 * proportional. */
const sizeStyles: Record<IconButtonSize, StyleProps & { boxSize: number }> = {
  xs: { fontSize: '$xs', borderRadius: '$sm', boxSize: 24 },
  sm: { fontSize: '$sm', borderRadius: '$sm', boxSize: 28 },
  md: { fontSize: '$md', borderRadius: '$md', boxSize: 36 },
  lg: { fontSize: '$lg', borderRadius: '$md', boxSize: 44 },
  xl: { fontSize: '$xl', borderRadius: '$lg', boxSize: 52 },
};

const intentTokens: Record<IconButtonIntent, IntentTokenBag> = {
  primary: {
    bg: '$colors.action.primary.bg',
    fg: '$colors.action.primary.fg',
    hover: '$colors.action.primary.hover',
    ink: '$colors.action.primary.bg',
  },
  danger: {
    bg: '$colors.action.danger.bg',
    fg: '$colors.action.danger.fg',
    hover: '$colors.action.danger.hover',
    ink: '$colors.action.danger.bg',
  },
  success: {
    bg: '$colors.action.success.bg',
    fg: '$colors.action.success.fg',
    hover: '$colors.action.success.hover',
    ink: '$colors.action.success.bg',
  },
  neutral: {
    bg: '$colors.action.neutral.bg',
    fg: '$colors.action.neutral.fg',
    hover: '$colors.action.neutral.hover',
    // The one intent whose fill is too pale to double as ink — an outline or
    // ghost neutral button reads as body text, not as a tinted accent.
    ink: '$colors.text.default',
  },
};

/**
 * Neutral built from the theme's own `gray` ramp — used when the theme has
 * no `action.neutral` but does define `gray`. Mirrors Button's middle tier.
 */
const NEUTRAL_GRAY_FALLBACK: IntentTokenBag = {
  bg: '$colors.gray.200',
  fg: '$colors.gray.900',
  hover: '$colors.gray.300',
  ink: '$colors.gray.900',
};

/**
 * Last-resort literal neutral palette, for a theme that defines neither
 * `action.neutral` nor a `gray` ramp; without it the intent emits
 * `var(--colors-action-neutral-*)` references that resolve to nothing.
 * Mirrors Button's fallbacks (Tailwind gray 100–900).
 *
 * Being literals, they cannot invert per theme — a dark theme that reaches
 * this tier still gets light-mode greys. Defining `action.neutral` is what
 * makes the intent theme-aware.
 */
const NEUTRAL_FALLBACK: IntentTokenBag = {
  bg: '#e5e7eb',
  fg: '#111827',
  hover: '#d1d5db',
  ink: '#111827',
};

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
const GHOST_HOVER_FALLBACK = '#f3f4f6';

function variantStylesFor(variant: IconButtonVariant, t: IntentTokenBag): StyleProps {
  if (variant === 'solid') {
    return {
      bg: t.bg,
      color: t.fg,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: t.bg,
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

function hoverFor(variant: IconButtonVariant, t: IntentTokenBag, ghostHoverBg: string): StyleProps {
  if (variant === 'solid') return { bg: t.hover, borderColor: t.hover };
  if (variant === 'outline') return { bg: t.hover, color: t.fg, borderColor: t.hover };
  return { bg: ghostHoverBg };
}

/**
 * Square interactive primitive for icon-only actions. Same visual
 * matrix as Button (variant × intent × size) but a fixed aspect ratio
 * with a centered icon child. `aria-label` is required — accessibility
 * non-negotiable.
 */
export const IconButton: MotifComponent<IconButtonProps, ReactElement | null> = function (
  props: IconButtonProps,
): ReactElement {
  const {
    variant = 'solid',
    intent = 'primary',
    size = 'md',
    loading = false,
    icon,
    children,
    disabled,
    ...rest
  } = props;
  const sizeBag = sizeStyles[size];
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
  const variantBag = variantStylesFor(variant, intentBag);
  const hoverBag = hoverFor(variant, intentBag, ghostHoverBg);
  const isDisabled = disabled === true || loading;
  const content = icon ?? children;

  return (
    <Pressable
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      w={sizeBag.boxSize}
      h={sizeBag.boxSize}
      fontSize={sizeBag.fontSize as string}
      borderRadius={sizeBag.borderRadius as string}
      cursor={isDisabled ? 'not-allowed' : 'pointer'}
      {...variantBag}
      {...(isDisabled ? { disabled: true } : {})}
      {...(loading ? { 'aria-busy': true } : {})}
      _hover={hoverBag}
      _focus={{ outlineStyle: 'solid', outlineWidth: 2, outlineColor: intentBag.bg }}
      _active={{ opacity: 0.85 }}
      _disabled={{ opacity: 0.5, cursor: 'not-allowed' }}
      {...rest}
    >
      <Box as="span" aria-hidden="true" display="inline-flex" alignItems="center">
        {loading ? <DefaultLoadingIndicator /> : content}
      </Box>
    </Pressable>
  );
};

function DefaultLoadingIndicator(): ReactElement {
  return (
    <Box
      as="span"
      display="inline-flex"
      alignItems="center"
      gap={2}
      style={{ letterSpacing: '0.1em' }}
    >
      <Box as="span" w={3} h={3} borderRadius="$full" bg="currentColor" opacity={0.85} />
      <Box as="span" w={3} h={3} borderRadius="$full" bg="currentColor" opacity={0.55} />
      <Box as="span" w={3} h={3} borderRadius="$full" bg="currentColor" opacity={0.25} />
    </Box>
  );
}
