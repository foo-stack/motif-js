import { Box } from '@motif-js/react';
import type { ReactNode } from 'react';

const TITLE_AXES = { opsz: 144, SOFT: 60 } as const;
const TITLE_EM_AXES = { opsz: 144, SOFT: 100 } as const;
const SUB_GAP = { mt: '12px' } as const;

/**
 * Shared landing-section wrapper. Replaces the chrome-era `.section` /
 * `.section__head` / `.section__eye` / `.section__title` / `.section__sub`
 * cascade. All landing components compose against this so the section
 * frame stays in one place.
 *
 * The `.h2` shared content-width container (max-width 1280, gutters 32)
 * is owned by this wrapper too — it's no longer in home.css after D-3.2.
 */
export function LandingSection({
  children,
  noBorder,
  py = 96,
}: {
  children: ReactNode;
  noBorder?: boolean;
  py?: number;
}) {
  return (
    <Box
      as="section"
      className="docs-section-pad"
      py={py}
      borderTopStyle={noBorder ? 'none' : 'solid'}
      borderTopWidth={noBorder ? 0 : 1}
      borderTopColor="$colors.line.faint"
    >
      <Box maxW={1280} mx="auto" px={32}>
        {children}
      </Box>
    </Box>
  );
}

/** Two-column section head — eye+title left, sub right. */
export function SectionHead({
  eye,
  title,
  sub,
}: {
  eye: ReactNode;
  title: ReactNode;
  sub?: ReactNode;
}) {
  return (
    <Box
      display="grid"
      gap={48}
      mb={56}
      alignItems="end"
      className="docs-section-head-2col"
      style={{ gridTemplateColumns: '1fr 1fr' }}
    >
      <Box>
        <SectionEye>{eye}</SectionEye>
        <SectionTitle>{title}</SectionTitle>
      </Box>
      {sub === undefined ? null : <SectionSub>{sub}</SectionSub>}
    </Box>
  );
}

/** Centered single-column section head. */
export function SectionHeadCenter({
  eye,
  title,
  sub,
}: {
  eye: ReactNode;
  title: ReactNode;
  sub?: ReactNode;
}) {
  return (
    <Box maxW={720} mx="auto" mb={56} textAlign="center">
      <SectionEye>{eye}</SectionEye>
      <SectionTitle>{title}</SectionTitle>
      {sub === undefined ? null : (
        <Box {...SUB_GAP} mx="auto">
          <SectionSub>{sub}</SectionSub>
        </Box>
      )}
    </Box>
  );
}

export function SectionEye({ children }: { children: ReactNode }) {
  return (
    <Box
      as="span"
      display="inline-flex"
      alignItems="center"
      gap={10}
      mb={16}
      fontFamily="$fontFamilies.mono"
      fontWeight={500}
      fontSize="11px"
      lineHeight={1}
      textTransform="uppercase"
      letterSpacing="0.14em"
      color="$colors.accent.base"
      _before={{
        content: '""',
        width: '18px',
        height: '1px',
        bg: '$colors.accent.base',
        opacity: 0.5,
      }}
    >
      {children}
    </Box>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <Box
      as="h2"
      className="docs-section-title"
      m={0}
      maxW={600}
      fontFamily="$fontFamilies.display"
      fontWeight={500}
      fontSize="56px"
      lineHeight={1.05}
      letterSpacing="-0.025em"
      color="$colors.fg.strong"
      fontVariationSettings={TITLE_AXES}
      style={{ textWrap: 'balance' }}
    >
      {children}
    </Box>
  );
}

/** `<em>` slot for section titles — switches Fraunces SOFT axis from 60 → 100 + italic + accent color. */
export function TitleEm({ children }: { children: ReactNode }) {
  return (
    <Box
      as="em"
      color="$colors.accent.base"
      fontWeight={400}
      fontVariationSettings={TITLE_EM_AXES}
      style={{ fontStyle: 'italic' }}
    >
      {children}
    </Box>
  );
}

export function SectionSub({ children }: { children: ReactNode }) {
  return (
    <Box
      as="p"
      m={0}
      maxW={480}
      fontFamily="$fontFamilies.sans"
      fontWeight={400}
      fontSize="18px"
      lineHeight={1.55}
      color="$colors.fg.muted"
      style={{ textWrap: 'pretty' }}
    >
      {children}
    </Box>
  );
}
