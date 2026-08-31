import { Box } from 'usemotif';
import type { ReactNode } from 'react';
import { Anchor } from '../chrome/Anchor.js';
import { sizeIconChildren } from './_icon-size.js';
import { LandingSection, SectionHead, TitleEm } from './_LandingSection.js';
import { Box as BoxIcon, Globe, Layers, Palette, Smartphone, Zap } from './icons.js';

const TITLE_AXES = { opsz: 36 } as const;
const STAT_AXES = { opsz: 144, SOFT: 60 } as const;
const STAT_EM_AXES = { opsz: 144, SOFT: 100 } as const;

export function BentoFeatures() {
  return (
    <LandingSection>
      <SectionHead
        eye="Why motif"
        title={
          <>
            A small set of <TitleEm>opinions</TitleEm>, well-tested.
          </>
        }
        sub="Cross-platform styling distilled into a layer that gets out of the way. Tokens that type-check, variants that compose, output that matches the platform."
      />

      <Box
        display="grid"
        gridTemplateColumns={{ base: 'repeat(2, 1fr)', lg: 'repeat(6, 1fr)' }}
        gridAutoRows="220px"
        gap={16}
      >
        <BentoCellLink href="/getting-started/cross-platform" variant="feature">
          <Box>
            <BentoIcon>
              <Globe />
            </BentoIcon>
            <BentoTitle>Universal by design</BentoTitle>
            <BentoDesc>
              One file. Web, iOS, Android, server. The same component, the same props, the same
              output - and the same TypeScript types.
            </BentoDesc>
          </Box>
          <Box display="flex" gap={8} flexWrap="wrap" mt={12}>
            <PlatformPill>
              <Globe /> Web
            </PlatformPill>
            <PlatformPill>
              <Smartphone /> iOS
            </PlatformPill>
            <PlatformPill>
              <Smartphone /> Android
            </PlatformPill>
            <PlatformPill>
              <BoxIcon /> SSR
            </PlatformPill>
            <PlatformPill>
              <BoxIcon /> RSC
            </PlatformPill>
          </Box>
        </BentoCellLink>

        <BentoCell variant="med">
          <Box>
            <BentoIcon>
              <Zap />
            </BentoIcon>
            <BentoTitle>Resolved once, then reused</BentoTitle>
            <BentoDesc>
              Styles resolve to deduped classes or platform style objects. The runtime is a dedup
              cache, not a parser.
            </BentoDesc>
          </Box>
        </BentoCell>

        <BentoCell variant="med">
          <BentoIcon>
            <BoxIcon />
          </BentoIcon>
          <Box
            mt={12}
            fontFamily="$fontFamilies.display"
            fontWeight={500}
            fontSize="64px"
            lineHeight={0.95}
            letterSpacing="-0.03em"
            color="$colors.accent.base"
            fontVariationSettings={STAT_AXES}
          >
            <Box as="em" fontVariationSettings={STAT_EM_AXES} style={{ fontStyle: 'italic' }}>
              12 KB
            </Box>
          </Box>
          <BentoDesc>
            Gzipped on web. Tree-shakes per import - only the props you use ship to your bundle.
          </BentoDesc>
        </BentoCell>

        <BentoCellLink href="/concepts/tokens" variant="sm">
          <BentoIcon>
            <Palette />
          </BentoIcon>
          <BentoTitle>Token-first</BentoTitle>
          <BentoDesc>Define the scale once. Reference it everywhere.</BentoDesc>
        </BentoCellLink>

        <BentoCellLink href="/concepts/variants" variant="sm">
          <BentoIcon>
            <Layers />
          </BentoIcon>
          <BentoTitle>Variants compose</BentoTitle>
          <BentoDesc>Map, merge, and override like any other data.</BentoDesc>
        </BentoCellLink>

        <BentoCellLink href="/concepts/responsive" variant="sm">
          <BentoIcon>
            <Smartphone />
          </BentoIcon>
          <BentoTitle>Platform-aware</BentoTitle>
          <BentoDesc>
            Container queries, safe areas, and pseudo-states on every primitive.
          </BentoDesc>
        </BentoCellLink>
      </Box>
    </LandingSection>
  );
}

type Variant = 'feature' | 'med' | 'sm';

// Bento cell placement: span 2 at base (over the 2-col mobile grid),
// then variant-dependent at lg (over the 6-col desktop grid).
const VARIANT_PLACEMENT: Readonly<
  Record<
    Variant,
    {
      readonly gridColumn: { base: string; lg: string };
      readonly gridRow?: { base: string; lg: string };
    }
  >
> = {
  feature: {
    gridColumn: { base: 'span 2', lg: 'span 3' },
    gridRow: { base: 'auto', lg: 'span 2' },
  },
  med: { gridColumn: { base: 'span 2', lg: 'span 3' } },
  sm: { gridColumn: { base: 'span 2', lg: 'span 2' } },
};

const CELL_PROPS = {
  borderStyle: 'solid' as const,
  borderWidth: 1,
  borderColor: '$colors.line.faint',
  borderRadius: '12px',
  p: 28,
  bg: '$colors.surface.paper2',
  position: 'relative' as const,
  overflow: 'hidden' as const,
  transition: 'all 200ms var(--easings-base)',
  display: 'flex' as const,
  flexDirection: 'column' as const,
  justifyContent: 'space-between' as const,
};

function BentoCell({ variant, children }: { variant: Variant; children: ReactNode }) {
  const place = VARIANT_PLACEMENT[variant];
  return (
    <Box
      gridColumn={place.gridColumn}
      {...(place.gridRow !== undefined ? { gridRow: place.gridRow } : {})}
      {...CELL_PROPS}
    >
      {children}
    </Box>
  );
}

function BentoCellLink({
  href,
  variant,
  children,
}: {
  href: string;
  variant: Variant;
  children: ReactNode;
}) {
  const place = VARIANT_PLACEMENT[variant];
  return (
    <Anchor
      href={href}
      gridColumn={place.gridColumn}
      {...(place.gridRow !== undefined ? { gridRow: place.gridRow } : {})}
      {...CELL_PROPS}
      color="$colors.fg.base"
      style={{ textDecoration: 'none' }}
      _hover={{ borderColor: '$colors.line.base', bg: '$colors.surface.paper3' }}
    >
      {children}
    </Anchor>
  );
}

function BentoIcon({ children }: { children: ReactNode }) {
  return (
    <Box as="span" color="$colors.accent.base" display="inline-block">
      {sizeIconChildren(children, 24)}
    </Box>
  );
}

function BentoTitle({ children }: { children: ReactNode }) {
  return (
    <Box
      mt={16}
      mb={8}
      fontFamily="$fontFamilies.display"
      fontWeight={600}
      fontSize="22px"
      lineHeight={1.2}
      color="$colors.fg.strong"
      fontVariationSettings={TITLE_AXES}
    >
      {children}
    </Box>
  );
}

function BentoDesc({ children }: { children: ReactNode }) {
  return (
    <Box
      as="p"
      m={0}
      fontFamily="$fontFamilies.sans"
      fontWeight={400}
      fontSize="14.5px"
      lineHeight={1.55}
      color="$colors.fg.muted"
      style={{ textWrap: 'pretty' }}
    >
      {children}
    </Box>
  );
}

function PlatformPill({ children }: { children: ReactNode }) {
  return (
    <Box
      as="span"
      display="inline-flex"
      alignItems="center"
      gap={6}
      py="5px"
      px="8px"
      fontFamily="$fontFamilies.mono"
      fontWeight={500}
      fontSize="11px"
      lineHeight={1}
      textTransform="uppercase"
      letterSpacing="0.08em"
      bg="$colors.surface.paper"
      borderStyle="solid"
      borderWidth={1}
      borderColor="$colors.line.faint"
      borderRadius="4px"
      color="$colors.fg.muted"
    >
      {sizeIconChildren(children, 11)}
    </Box>
  );
}
