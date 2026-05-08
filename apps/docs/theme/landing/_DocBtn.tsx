import type { ReactNode } from 'react';
import { Anchor, Btn } from '../chrome/Anchor.js';
import { sizeIconChildren } from './_icon-size.js';

type Variant = 'primary' | 'ghost' | 'copyInstall';

const BASE_PROPS = {
  display: 'inline-flex' as const,
  alignItems: 'center' as const,
  gap: 8,
  py: '11px',
  px: '16px',
  borderRadius: '6px' as const,
  borderStyle: 'solid' as const,
  borderWidth: 1,
  borderColor: 'transparent' as const,
  cursor: 'pointer' as const,
  transition: 'all 160ms var(--easings-base)',
  fontFamily: '$fontFamilies.sans' as const,
  fontWeight: 500,
  fontSize: '14px' as const,
  lineHeight: 1,
  className: 'docs-btn-press',
  style: { textDecoration: 'none' as const, whiteSpace: 'nowrap' as const },
};

const VARIANTS: Record<
  Variant,
  {
    bg: string;
    color: string;
    borderColor?: string;
    fontFamily?: string;
    fontSize?: string;
    py?: string;
    px?: string;
    gap?: number;
    _hover: { bg?: string; borderColor?: string };
  }
> = {
  primary: {
    bg: '$colors.accent.base',
    color: '$colors.accent.fg',
    _hover: { bg: '$colors.accent.hover' },
  },
  ghost: {
    bg: 'transparent',
    color: '$colors.fg.strong',
    borderColor: '$colors.line.base',
    _hover: { bg: '$colors.surface.paper2', borderColor: '$colors.line.strong' },
  },
  copyInstall: {
    bg: '$colors.surface.paper2',
    color: '$colors.fg.strong',
    borderColor: '$colors.line.base',
    fontFamily: '$fontFamilies.mono',
    fontSize: '13px',
    py: '11px',
    px: '14px',
    gap: 12,
    _hover: { borderColor: '$colors.line.strong' },
  },
};

export interface DocBtnAnchorProps {
  href: string;
  variant: Variant;
  children: ReactNode;
  rel?: string;
}

export interface DocBtnButtonProps {
  variant: Variant;
  children: ReactNode;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  title?: string;
  'aria-label'?: string;
}

export function DocAnchorBtn({ href, variant, children, rel }: DocBtnAnchorProps) {
  const v = VARIANTS[variant];
  return (
    <Anchor
      href={href}
      rel={rel}
      {...BASE_PROPS}
      bg={v.bg}
      color={v.color}
      borderColor={v.borderColor ?? 'transparent'}
      _hover={v._hover}
    >
      {sizeIconChildren(children, 14)}
    </Anchor>
  );
}

export function DocPressBtn({
  variant,
  children,
  type = 'button',
  onClick,
  title,
  'aria-label': ariaLabel,
}: DocBtnButtonProps) {
  const v = VARIANTS[variant];
  return (
    <Btn
      type={type}
      onClick={onClick}
      {...(title ? { title } : {})}
      {...(ariaLabel ? { 'aria-label': ariaLabel } : {})}
      {...BASE_PROPS}
      bg={v.bg}
      color={v.color}
      borderColor={v.borderColor ?? 'transparent'}
      {...(v.fontFamily ? { fontFamily: v.fontFamily } : {})}
      {...(v.fontSize ? { fontSize: v.fontSize } : {})}
      {...(v.py ? { py: v.py } : {})}
      {...(v.px ? { px: v.px } : {})}
      {...(v.gap !== undefined ? { gap: v.gap } : {})}
      _hover={v._hover}
    >
      {sizeIconChildren(children, 14)}
    </Btn>
  );
}
