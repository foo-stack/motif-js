import type { StyleProps } from '@usemotif/core';
import { type ReactElement, type ReactNode } from 'react';
import { Box } from './Box.js';
import type { GestureResponderEvent } from 'react-native';
import { Pressable, type PressableProps } from './Pressable.js';
import { Text } from './Text.js';
import { useTheme } from './theme-context.js';

export type ButtonVariant = 'solid' | 'outline' | 'ghost';
export type ButtonIntent = 'primary' | 'danger' | 'success' | 'neutral';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends Omit<
  PressableProps,
  'children' | '_hover' | '_focus' | '_active' | '_disabled'
> {
  variant?: ButtonVariant;
  intent?: ButtonIntent;
  size?: ButtonSize;
  loading?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  loadingIcon?: ReactNode;
  loadingLabel?: ReactNode;
  fullWidth?: boolean;
  children?: ReactNode;
}

/**
 * Per-size style bag — identical to the web Button's so the shared
 * conformance contract holds. Native uses the same token scale via
 * JS-context resolution.
 *
 * `fontSize` is a text style: on native it's split out of this bag and
 * applied to the label `<Text>`, not the `<Pressable>` (a `View`),
 * which silently drops text-style props. See `Button` below.
 */
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
}

const intentTokens: Record<ButtonIntent, IntentTokenBag> = {
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
 * Literal neutral palette used when the active theme defines no `gray`
 * scale. `intent="neutral"` (and the ghost-variant hover) reference
 * `$colors.gray.*`, which only `@usemotif/tokens` guarantees — a
 * hand-authored `createTheme` theme need not define one. Without a
 * fallback those tokens stay unresolved and render as raw `$colors…`
 * strings. These literals (Tailwind's gray 100/200/300/900) keep a
 * neutral button rendering a real colour on any theme.
 */
const NEUTRAL_FALLBACK: IntentTokenBag = {
  bg: '#e5e7eb',
  fg: '#111827',
  hover: '#d1d5db',
  border: '#d1d5db',
};

/** Ghost-variant hover tint used when no `gray` scale is present. */
const GHOST_HOVER_FALLBACK = '#f3f4f6';

/**
 * Variant style bag for the `<Pressable>` surface. Returns `color`
 * (the label foreground) alongside the box styles; the caller splits
 * `color` off onto the label `<Text>` since a `View` ignores it.
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

function hoverFor(variant: ButtonVariant, t: IntentTokenBag, ghostHoverBg: string): StyleProps {
  if (variant === 'solid') return { bg: t.hover, borderColor: t.hover };
  if (variant === 'outline') return { bg: t.hover, color: t.fg, borderColor: t.hover };
  return { bg: ghostHoverBg };
}

function DefaultLoadingIndicator(): ReactElement {
  return (
    <Box
      flexDirection="row"
      alignItems="center"
      gap={2}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Box w={4} h={4} borderRadius="$full" bg="currentColor" opacity={0.85} />
      <Box w={4} h={4} borderRadius="$full" bg="currentColor" opacity={0.55} />
      <Box w={4} h={4} borderRadius="$full" bg="currentColor" opacity={0.25} />
    </Box>
  );
}

/**
 * Native Button — same prop shape as the web Button. Composes
 * `<Pressable>` for the platform-correct touch / focus / hover
 * plumbing (RN's Pressable surfaces those states as render-prop
 * booleans, which our Pressable wrapper translates into the same
 * `_hover` / `_focus` / `_active` / `_disabled` style bags).
 *
 * Unlike web, where a `<button>` renders text children directly and
 * inherits text styles via the CSS cascade, RN forbids a bare
 * string/number outside a `<Text>` host and a `View` silently drops
 * text-style props. So a string/number label is wrapped in `<Text>`
 * and the label text styles (`color` / `fontSize` / `fontWeight`) are
 * applied to that `<Text>` rather than the `<Pressable>`. Element
 * children pass through untouched — styling them is the caller's job.
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
    ...rest
  } = props;

  // Resolve the intent palette against the active theme: `neutral`
  // (and the ghost hover) need a `gray` scale, so fall back to literal
  // greys when the theme doesn't define one.
  const theme = useTheme();
  const hasGrayScale = theme?.tokens?.colors?.gray !== undefined;
  const intentBag: IntentTokenBag =
    intent === 'neutral' && !hasGrayScale ? NEUTRAL_FALLBACK : intentTokens[intent];
  const ghostHoverBg = hasGrayScale ? '$colors.gray.100' : GHOST_HOVER_FALLBACK;

  // Split text styles (`fontSize`, `color`) out of the box bags — they
  // belong on the label `<Text>`, not the `<Pressable>` `View`.
  const { fontSize: labelFontSize, ...pressableSizeBag } = sizeStyles[size];
  const { color: labelColor, ...pressableVariantBag } = variantStylesFor(variant, intentBag);
  const hoverBag = hoverFor(variant, intentBag, ghostHoverBg);
  const widthBag: StyleProps = fullWidth ? { width: '$full' } : {};
  const isDisabled = disabled === true || loading;

  type Handler = (event: GestureResponderEvent) => void;
  let handler: Handler | undefined;
  if (!isDisabled && typeof onPress === 'function') {
    handler = onPress as Handler;
  }
  const indicator = loading ? (loadingIcon ?? <DefaultLoadingIndicator />) : leadingIcon;
  const label = loading && loadingLabel !== undefined ? loadingLabel : children;

  // A bare string/number can't render inside a `View`; wrap it in
  // `<Text>` and apply the label text styles there. Element children
  // are passed through as-is.
  const renderedLabel: ReactNode =
    typeof label === 'string' || typeof label === 'number' ? (
      <Text
        {...(labelColor !== undefined ? { color: labelColor } : {})}
        {...(labelFontSize !== undefined ? { fontSize: labelFontSize } : {})}
        fontWeight="$semibold"
      >
        {label}
      </Text>
    ) : (
      label
    );

  return (
    <Pressable
      flexDirection="row"
      alignItems="center"
      justifyContent="center"
      {...pressableSizeBag}
      {...pressableVariantBag}
      {...widthBag}
      {...(isDisabled ? { disabled: true } : {})}
      {...(loading ? { accessibilityState: { busy: true, disabled: true } } : {})}
      _hover={hoverBag}
      _focus={{ borderColor: intentBag.bg, borderWidth: 2 }}
      _active={{ opacity: 0.85 }}
      _disabled={{ opacity: 0.5 }}
      {...(handler !== undefined ? { onPress: handler } : {})}
      {...rest}
    >
      {indicator !== undefined && indicator !== null ? <Box>{indicator}</Box> : null}
      {renderedLabel}
      {trailingIcon !== undefined && trailingIcon !== null ? <Box>{trailingIcon}</Box> : null}
    </Pressable>
  );
}
