import type { StyleProps } from '@usemotif/core';
import type { GestureResponderEvent } from 'react-native';
import { type ReactElement, type ReactNode } from 'react';
import { Box } from './Box.js';
import { Pressable, type PressableProps } from './Pressable.js';
import { useTheme } from './theme-context.js';

export type IconButtonVariant = 'solid' | 'outline' | 'ghost';
export type IconButtonIntent = 'primary' | 'danger' | 'success' | 'neutral';
export type IconButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface IconButtonProps extends Omit<
  PressableProps,
  'children' | '_hover' | '_focus' | '_active' | '_disabled'
> {
  /** Required label for screen readers; the icon is hidden from a11y. */
  accessibilityLabel: string;
  variant?: IconButtonVariant;
  intent?: IconButtonIntent;
  size?: IconButtonSize;
  loading?: boolean;
  icon?: ReactNode;
  children?: ReactNode;
}

const sizeStyles: Record<IconButtonSize, { fontSize: string; borderRadius: string; box: number }> =
  {
    xs: { fontSize: '$xs', borderRadius: '$sm', box: 24 },
    sm: { fontSize: '$sm', borderRadius: '$sm', box: 28 },
    md: { fontSize: '$md', borderRadius: '$md', box: 36 },
    lg: { fontSize: '$lg', borderRadius: '$md', box: 44 },
    xl: { fontSize: '$xl', borderRadius: '$lg', box: 52 },
  };

type IntentTokenBag = { bg: string; fg: string; hover: string };

const intentTokens: Record<IconButtonIntent, IntentTokenBag> = {
  primary: {
    bg: '$colors.action.primary.bg',
    fg: '$colors.action.primary.fg',
    hover: '$colors.action.primary.hover',
  },
  danger: {
    bg: '$colors.action.danger.bg',
    fg: '$colors.action.danger.fg',
    hover: '$colors.action.danger.hover',
  },
  success: {
    bg: '$colors.action.success.bg',
    fg: '$colors.action.success.fg',
    hover: '$colors.action.success.hover',
  },
  neutral: {
    bg: '$colors.gray.200',
    fg: '$colors.gray.900',
    hover: '$colors.gray.300',
  },
};

/**
 * Literal neutral palette + ghost hover tint used when the active theme
 * defines no `gray` scale. `intent="neutral"` and the ghost-variant hover
 * reference `$colors.gray.*`, which only `@usemotif/tokens` guarantees;
 * without a fallback those emit unresolved `var(--colors-gray-*)` and
 * render colourless. Mirrors the web IconButton / Button fallbacks.
 */
const NEUTRAL_FALLBACK: IntentTokenBag = {
  bg: '#e5e7eb',
  fg: '#111827',
  hover: '#d1d5db',
};
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

function hoverFor(variant: IconButtonVariant, t: IntentTokenBag, ghostHoverBg: string): StyleProps {
  if (variant === 'solid') return { bg: t.hover, borderColor: t.hover };
  if (variant === 'outline') return { bg: t.hover, color: t.fg, borderColor: t.hover };
  return { bg: ghostHoverBg };
}

export function IconButton(props: IconButtonProps): ReactElement {
  const {
    variant = 'solid',
    intent = 'primary',
    size = 'md',
    loading = false,
    icon,
    children,
    disabled,
    onPress,
    ...rest
  } = props;
  const sizeBag = sizeStyles[size];
  // Fall back to literal neutral colours when the theme has no `gray` scale,
  // otherwise neutral/ghost emit unresolved var(--colors-gray-*).
  const theme = useTheme();
  const hasGrayScale = theme?.tokens?.colors?.gray !== undefined;
  const intentBag: IntentTokenBag =
    intent === 'neutral' && !hasGrayScale ? NEUTRAL_FALLBACK : intentTokens[intent];
  const ghostHoverBg = hasGrayScale ? '$colors.gray.100' : GHOST_HOVER_FALLBACK;
  const variantBag = variantStylesFor(variant, intentBag);
  const hoverBag = hoverFor(variant, intentBag, ghostHoverBg);
  const isDisabled = disabled === true || loading;
  const content = icon ?? children;

  type Handler = (event: GestureResponderEvent) => void;
  let handler: Handler | undefined;
  if (!isDisabled && typeof onPress === 'function') handler = onPress as Handler;

  return (
    <Pressable
      accessibilityRole="button"
      alignItems="center"
      justifyContent="center"
      w={sizeBag.box}
      h={sizeBag.box}
      fontSize={sizeBag.fontSize}
      borderRadius={sizeBag.borderRadius}
      {...variantBag}
      {...(isDisabled ? { disabled: true } : {})}
      {...(loading ? { accessibilityState: { busy: true, disabled: true } } : {})}
      _hover={hoverBag}
      _focus={{ borderColor: intentBag.bg, borderWidth: 2 }}
      _active={{ opacity: 0.85 }}
      _disabled={{ opacity: 0.5 }}
      {...(handler !== undefined ? { onPress: handler } : {})}
      {...rest}
    >
      <Box accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        {loading ? <DefaultLoadingIndicator color={variantBag.color} /> : content}
      </Box>
    </Pressable>
  );
}

function DefaultLoadingIndicator({ color }: { color: StyleProps['color'] }): ReactElement {
  // RN has no `currentColor` keyword (it renders as an invalid color →
  // invisible dots), so the fill must be the resolved foreground passed in.
  const dotColor = color ?? '$colors.text.default';
  return (
    <Box flexDirection="row" alignItems="center" gap={2}>
      <Box w={3} h={3} borderRadius="$full" bg={dotColor} opacity={0.85} />
      <Box w={3} h={3} borderRadius="$full" bg={dotColor} opacity={0.55} />
      <Box w={3} h={3} borderRadius="$full" bg={dotColor} opacity={0.25} />
    </Box>
  );
}
