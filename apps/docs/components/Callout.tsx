import { Box } from 'usemotif';
import type { ReactNode } from 'react';
import { warnOnUnknownVariant } from './_callout-warning.js';
import { Danger, Info, Tip, Warning } from './icons.js';

/**
 * The declared union, as an array so it has a runtime form.
 * `scripts/check-callout-variants.mjs` reads this list out of this file rather
 * than repeating it, so the check cannot drift from the component.
 */
export const CALLOUT_VARIANTS = ['info', 'warning', 'tip', 'danger'] as const;

type Variant = (typeof CALLOUT_VARIANTS)[number];

const ICONS: Record<Variant, typeof Info> = {
  info: Info,
  warning: Warning,
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
  //
  // Cosmetic is not harmless, though. A mistyped `danger` renders as a neutral
  // note, so a warning the reader is meant to heed loses its severity and
  // nothing anywhere says so. The fallback ships; the warning tells whoever is
  // editing the page, while they are editing it.
  warnOnUnknownVariant(variant, CALLOUT_VARIANTS);
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
