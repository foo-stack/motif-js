import type { StyleProps } from '@motif-js/core';
import { type ReactElement, type ReactNode } from 'react';
import { Box } from './Box.js';
import type { GestureResponderEvent } from 'react-native';
import { Pressable, type PressableProps } from './Pressable.js';

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
 */
const sizeStyles: Record<ButtonSize, StyleProps> = {
  xs: { px: '$2', py: '$1', fontSize: '$xs', borderRadius: '$sm', gap: '$1' },
  sm: { px: '$3', py: '$1.5', fontSize: '$sm', borderRadius: '$sm', gap: '$1.5' },
  md: { px: '$4', py: '$2', fontSize: '$md', borderRadius: '$md', gap: '$2' },
  lg: { px: '$5', py: '$2.5', fontSize: '$lg', borderRadius: '$md', gap: '$2' },
  xl: { px: '$6', py: '$3', fontSize: '$xl', borderRadius: '$lg', gap: '$2.5' },
};

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

function hoverFor(variant: ButtonVariant, intent: ButtonIntent): StyleProps {
  const t = intentTokens[intent];
  if (variant === 'solid') return { bg: t.hover, borderColor: t.hover };
  if (variant === 'outline') return { bg: t.hover, color: t.fg, borderColor: t.hover };
  return { bg: '$colors.gray.100' };
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

  const sizeBag = sizeStyles[size];
  const variantBag = variantStylesFor(variant, intent);
  const hoverBag = hoverFor(variant, intent);
  const widthBag: StyleProps = fullWidth ? { width: '$full' } : {};
  const isDisabled = disabled === true || loading;

  type Handler = (event: GestureResponderEvent) => void;
  let handler: Handler | undefined;
  if (!isDisabled && typeof onPress === 'function') {
    handler = onPress as Handler;
  }
  const indicator = loading ? (loadingIcon ?? <DefaultLoadingIndicator />) : leadingIcon;
  const label = loading && loadingLabel !== undefined ? loadingLabel : children;

  return (
    <Pressable
      flexDirection="row"
      alignItems="center"
      justifyContent="center"
      fontWeight="$semibold"
      {...sizeBag}
      {...variantBag}
      {...widthBag}
      {...(isDisabled ? { disabled: true } : {})}
      {...(loading ? { accessibilityState: { busy: true, disabled: true } } : {})}
      _hover={hoverBag}
      _focus={{ borderColor: intentTokens[intent].bg, borderWidth: 2 }}
      _active={{ opacity: 0.85 }}
      _disabled={{ opacity: 0.5 }}
      {...(handler !== undefined ? { onPress: handler } : {})}
      {...rest}
    >
      {indicator !== undefined && indicator !== null ? <Box>{indicator}</Box> : null}
      {label}
      {trailingIcon !== undefined && trailingIcon !== null ? <Box>{trailingIcon}</Box> : null}
    </Pressable>
  );
}
