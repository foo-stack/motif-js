import { Box } from '@motif-js/react';
import type { ReactNode } from 'react';
import { Danger, Info, Tip, Warn } from './icons.js';

type Variant = 'info' | 'warning' | 'tip' | 'danger';

const ICONS: Record<Variant, typeof Info> = {
  info: Info,
  warning: Warn,
  tip: Tip,
  danger: Danger,
};

const DEFAULT_TITLES: Record<Variant, string> = {
  info: 'Note',
  warning: 'Heads up',
  tip: 'Tip',
  danger: 'Caution',
};

const ACCENT_TOKEN: Record<Variant, string> = {
  info: '$colors.status.info',
  warning: '$colors.status.warning',
  tip: '$colors.status.success',
  danger: '$colors.status.error',
};

export interface CalloutProps {
  children: ReactNode;
  title?: ReactNode;
  variant?: Variant;
}

export function Callout({ children, title, variant = 'info' }: CalloutProps) {
  const Icon = ICONS[variant];
  const accent = ACCENT_TOKEN[variant];
  return (
    <Box
      as="aside"
      display="grid"
      gap={12}
      my={26}
      py={14}
      px={16}
      borderStyle="solid"
      borderWidth={1}
      borderColor="$colors.line.base"
      borderLeftStyle="solid"
      borderLeftWidth={1}
      borderLeftColor={accent}
      borderRadius="6px"
      bg="$colors.surface.paper"
      color={accent}
      style={{ gridTemplateColumns: '20px 1fr' }}
    >
      <Box as="span" aria-hidden="true" pt="2px">
        <Icon width={18} height={18} />
      </Box>
      <Box>
        <Box
          mb="3px"
          fontFamily="$fontFamilies.sans"
          fontWeight={600}
          fontSize="13.5px"
          lineHeight={1.3}
          color="$colors.fg.strong"
        >
          {title ?? DEFAULT_TITLES[variant]}
        </Box>
        <Box
          fontFamily="$fontFamilies.sans"
          fontWeight={400}
          fontSize="14.5px"
          lineHeight={1.55}
          color="$colors.fg.muted"
          className="callout__body"
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
