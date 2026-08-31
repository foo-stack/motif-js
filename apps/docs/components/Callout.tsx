import { Box } from 'usemotif';
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
  // MDX is not typechecked, so a page can pass any string here. An unknown one
  // used to make `ICONS[variant]` undefined, and rendering `<undefined />`
  // throws "Element type is invalid", which unmounts the whole route: four
  // documentation pages shipped blank for months on a single mistyped word,
  // and the visual baselines recorded the blank pages as correct. Falling back
  // keeps a typo cosmetic.
  const safe: Variant = variant in ICONS ? variant : 'info';
  const Icon = ICONS[safe];
  const accent = ACCENT_TOKEN[safe];
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
          {title ?? DEFAULT_TITLES[safe]}
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
