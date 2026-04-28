'use client';

import type { StyleProps } from '@motif-js/core';
import { type ReactElement, type ReactNode } from 'react';
import { Box } from './Box.js';
import { Pressable, type PressableProps } from './Pressable.js';

export type IconButtonVariant = 'solid' | 'outline' | 'ghost';
export type IconButtonIntent = 'primary' | 'danger' | 'success' | 'neutral';
export type IconButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface IconButtonProps extends Omit<
  PressableProps,
  'children' | '_hover' | '_focus' | '_active' | '_disabled'
> {
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

const intentTokens: Record<IconButtonIntent, { bg: string; fg: string; hover: string }> = {
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

function variantStylesFor(variant: IconButtonVariant, intent: IconButtonIntent): StyleProps {
  const t = intentTokens[intent];
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

function hoverFor(variant: IconButtonVariant, intent: IconButtonIntent): StyleProps {
  const t = intentTokens[intent];
  if (variant === 'solid') return { bg: t.hover, borderColor: t.hover };
  if (variant === 'outline') return { bg: t.hover, color: t.fg, borderColor: t.hover };
  return { bg: '$colors.gray.100' };
}

/**
 * Square interactive primitive for icon-only actions. Same visual
 * matrix as Button (variant × intent × size) but a fixed aspect ratio
 * with a centered icon child. `aria-label` is required — accessibility
 * non-negotiable.
 */
export function IconButton(props: IconButtonProps): ReactElement {
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
  const variantBag = variantStylesFor(variant, intent);
  const hoverBag = hoverFor(variant, intent);
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
      _focus={{ outlineStyle: 'solid', outlineWidth: 2, outlineColor: intentTokens[intent].bg }}
      _active={{ opacity: 0.85 }}
      _disabled={{ opacity: 0.5, cursor: 'not-allowed' }}
      {...rest}
    >
      <Box as="span" aria-hidden="true" display="inline-flex" alignItems="center">
        {loading ? <DefaultLoadingIndicator /> : content}
      </Box>
    </Pressable>
  );
}

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
