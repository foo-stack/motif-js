import { Box } from 'usemotif';
import type { ReactElement, ReactNode } from 'react';
import { LandingSection, SectionHeadCenter } from './_LandingSection.js';
import { Check, Sparkle } from './icons.js';

// `unknown` is a real state, not a gap we forgot to fill. Every competitor cell
// here is a claim about somebody else's library, so it is either backed by a
// citation in `.claims.json` or it says so. Guessing is what produced the table
// this one replaces.
type Cell = 'ok' | 'no' | 'partial' | 'unknown';
interface Row {
  k: string;
  motif: Cell;
  a: Cell;
  b: Cell;
}

// Tamagui and NativeWind, because those are the libraries a reader choosing a
// cross-platform styling layer actually weighs motif against. The previous set
// was styled-components, vanilla-extract and CSS Modules, all web-only, which
// made the first row a walkover rather than a comparison.
//
// Bundle size used to be a row here and is deliberately gone. Comparing gzipped
// sizes across libraries needs one shared measurement method, and motif's own
// figure comes from a specific per-import denominator that is not comparable to
// a number lifted from someone else's README. A row that invites that mistake
// is worse than no row.
const rows: readonly Row[] = [
  { k: 'Universal (web + native)', motif: 'ok', a: 'ok', b: 'ok' },
  { k: 'Deduped CSS output', motif: 'ok', a: 'ok', b: 'unknown' },
  { k: 'Type-safe tokens and variants', motif: 'ok', a: 'ok', b: 'partial' },
  { k: 'Compose without a build plugin', motif: 'ok', a: 'ok', b: 'no' },
  { k: 'SSR first-paint', motif: 'ok', a: 'ok', b: 'unknown' },
  { k: 'Renders from a Server Component', motif: 'partial', a: 'ok', b: 'unknown' },
  { k: 'Container queries', motif: 'ok', a: 'ok', b: 'ok' },
  { k: 'Pseudo-state props on every primitive', motif: 'ok', a: 'ok', b: 'unknown' },
];

function cellGlyph(v: Cell): ReactElement {
  if (v === 'ok')
    return (
      <Box as="span" color="$colors.status.success">
        <Check width={16} height={16} />
      </Box>
    );
  if (v === 'no')
    return (
      <Box as="span" color="$colors.fg.faint">
        —
      </Box>
    );
  if (v === 'partial')
    return (
      <Box as="span" color="$colors.status.warning">
        Partial
      </Box>
    );
  return (
    <Box
      as="span"
      color="$colors.fg.faint"
      title="Not verified against that library's documentation"
    >
      ?
    </Box>
  );
}

export function Comparison() {
  return (
    <LandingSection>
      <SectionHeadCenter
        eye="Compared"
        title="Honest, side-by-side."
        sub="The two libraries a cross-platform React app is most likely to weigh motif against. We like them both. Use whichever fits your team; here is where the three differ."
      />

      <Box
        borderStyle="solid"
        borderWidth={1}
        borderColor="$colors.line.faint"
        borderRadius="12px"
        overflow="hidden"
      >
        <Box
          display="grid"
          gridTemplateColumns={{ base: '1.4fr 1fr 1fr 1fr' }}
          bg="$colors.surface.paper2"
          borderBottomStyle="solid"
          borderBottomWidth={1}
          borderBottomColor="$colors.line.faint"
        >
          <CompareHead>Feature</CompareHead>
          <CompareHead motif>
            <Sparkle width={14} height={14} /> motif
          </CompareHead>
          <CompareHead>Tamagui</CompareHead>
          <CompareHead last>NativeWind</CompareHead>
        </Box>
        {rows.map((r, idx) => (
          <Box
            key={r.k}
            display="grid"
            gridTemplateColumns={{ base: '1.4fr 1fr 1fr 1fr' }}
            borderBottomStyle={idx === rows.length - 1 ? 'none' : 'solid'}
            borderBottomWidth={idx === rows.length - 1 ? 0 : 1}
            borderBottomColor="$colors.line.faint"
          >
            <CompareCell label>{r.k}</CompareCell>
            <CompareCell motif>{cellGlyph(r.motif)}</CompareCell>
            <CompareCell>{cellGlyph(r.a)}</CompareCell>
            <CompareCell last>{cellGlyph(r.b)}</CompareCell>
          </Box>
        ))}
      </Box>
      <Box
        mt={16}
        textAlign="center"
        fontSize="12px"
        lineHeight={1.5}
        color="$colors.fg.faint"
        fontFamily="$fontFamilies.sans"
      >
        A{' '}
        <Box as="span" color="$colors.fg.muted">
          ?
        </Box>{' '}
        means we have not verified that cell against the library's own documentation. Every other
        competitor cell is backed by a citation, kept alongside the claim it supports.
      </Box>
    </LandingSection>
  );
}

function CompareHead({
  children,
  motif,
  hideBelowLg,
  last,
}: {
  children: ReactNode;
  motif?: boolean;
  hideBelowLg?: boolean;
  last?: boolean;
}) {
  return (
    <Box
      display={hideBelowLg ? { base: 'none', lg: 'flex' } : 'flex'}
      alignItems="center"
      gap={8}
      py={18}
      px={20}
      fontFamily="$fontFamilies.mono"
      fontWeight={motif ? 600 : 500}
      fontSize="12px"
      lineHeight={1}
      textTransform="uppercase"
      letterSpacing="0.1em"
      color={motif ? '$colors.accent.muted' : '$colors.fg.faint'}
      bg={motif ? '$colors.accent.soft' : 'transparent'}
      borderRightStyle={last ? 'none' : 'solid'}
      borderRightWidth={last ? 0 : 1}
      borderRightColor="$colors.line.faint"
    >
      {children}
    </Box>
  );
}

function CompareCell({
  children,
  label,
  motif,
  hideBelowLg,
  last,
}: {
  children: ReactNode;
  label?: boolean;
  motif?: boolean;
  hideBelowLg?: boolean;
  last?: boolean;
}) {
  return (
    <Box
      display={hideBelowLg ? { base: 'none', lg: 'flex' } : 'flex'}
      alignItems="center"
      gap={8}
      py={16}
      px={20}
      fontFamily="$fontFamilies.sans"
      fontWeight={label ? 500 : 400}
      fontSize="14.5px"
      lineHeight={1.4}
      color={label ? '$colors.fg.strong' : '$colors.fg.base'}
      borderRightStyle={last ? 'none' : 'solid'}
      borderRightWidth={last ? 0 : 1}
      borderRightColor="$colors.line.faint"
      {...(motif
        ? {
            style: {
              background: 'color-mix(in oklab, var(--colors-accent-base) 4%, transparent)',
            },
          }
        : {})}
    >
      {children}
    </Box>
  );
}
