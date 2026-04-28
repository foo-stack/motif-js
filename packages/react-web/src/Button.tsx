'use client';

import type { StyleProps } from '@motif-js/core';
import { type ReactElement, type ReactNode } from 'react';
import { Box } from './Box.js';
import { Pressable, type PressableProps } from './Pressable.js';

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
 * scales (see `@motif-js/tokens`).
 */
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends Omit<
  PressableProps,
  'children' | '_hover' | '_focus' | '_active' | '_disabled'
> {
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

/**
 * Per-intent token mapping. The token strings reference the workspace's
 * `$colors.action.<intent>` namespace (defined in `@motif-js/tokens`'s
 * light + dark themes), with a fallback to a neutral mapping built from
 * the `gray` scale.
 */
const intentTokens: Record<
  ButtonIntent,
  { bg: string; fg: string; hover: string; border: string }
> = {
  primary: {
    bg: '$colors.action.primary.bg',
    fg: '$colors.action.primary.fg',
    hover: '$colors.action.primary.hover',
    border: '$colors.action.primary.bg',
  },
  danger: {
    bg: '$colors.action.danger.bg',
    fg: '$colors.action.danger.fg',
    hover: '$colors.action.danger.hover',
    border: '$colors.action.danger.bg',
  },
  success: {
    bg: '$colors.action.success.bg',
    fg: '$colors.action.success.fg',
    hover: '$colors.action.success.hover',
    border: '$colors.action.success.bg',
  },
  neutral: {
    bg: '$colors.gray.200',
    fg: '$colors.gray.900',
    hover: '$colors.gray.300',
    border: '$colors.gray.300',
  },
};

/**
 * Compose the per-(variant × intent) style bag. Variants vary in which
 * tokens land on background / color / border:
 *
 * - solid: bg = intent.bg, fg = intent.fg, hover bg = intent.hover.
 * - outline: bg = transparent, fg = intent.bg (acts as the accent),
 *   border = intent.bg, hover bg = intent.bg + low alpha (approximated
 *   via a tinted hover token).
 * - ghost: bg = transparent, fg = intent.bg, no border, hover = neutral
 *   tint.
 */
function variantStylesFor(variant: ButtonVariant, intent: ButtonIntent): StyleProps {
  const t = intentTokens[intent];
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
      color: t.bg,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: t.bg,
    };
  }
  return {
    bg: 'transparent',
    color: t.bg,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'transparent',
  };
}

/** Pseudo-state hover style per (variant × intent). */
function hoverFor(variant: ButtonVariant, intent: ButtonIntent): StyleProps {
  const t = intentTokens[intent];
  if (variant === 'solid') return { bg: t.hover, borderColor: t.hover };
  if (variant === 'outline') return { bg: t.hover, color: t.fg, borderColor: t.hover };
  return { bg: '$colors.gray.100' };
}

/** Default loading indicator — a small neutral dot stack. Animation-free
 * by design (Phase G handles motion); callers wanting a spinner pass
 * `loadingIcon`. */
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
export function Button(props: ButtonProps): ReactElement {
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

  const sizeBag = sizeStyles[size];
  const variantBag = variantStylesFor(variant, intent);
  const hoverBag = hoverFor(variant, intent);

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
      _focus={{ outlineStyle: 'solid', outlineWidth: 2, outlineColor: intentTokens[intent].bg }}
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
}
