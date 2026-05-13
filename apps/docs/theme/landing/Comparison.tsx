import { Box } from 'motif-js';
import type { ReactElement, ReactNode } from 'react';
import { LandingSection, SectionHeadCenter } from './_LandingSection.js';
import { Check, Sparkle } from './icons.js';

type Cell = 'ok' | 'no' | 'partial' | string;
interface Row {
  k: string;
  motif: Cell;
  a: Cell;
  b: Cell;
  c: Cell;
}

const rows: readonly Row[] = [
  { k: 'Universal (web + native)', motif: 'ok', a: 'no', b: 'partial', c: 'no' },
  { k: 'Compiled, atomic CSS', motif: 'ok', a: 'partial', b: 'ok', c: 'no' },
  { k: 'Type-safe tokens and variants', motif: 'ok', a: 'partial', b: 'partial', c: 'no' },
  { k: 'Compose without Babel/SWC plugin', motif: 'ok', a: 'ok', b: 'no', c: 'ok' },
  { k: 'Bundle size (gzipped)', motif: '12 KB', a: '12 KB', b: '0 KB', c: '8 KB' },
  { k: 'SSR / RSC first-paint', motif: 'ok', a: 'ok', b: 'ok', c: 'partial' },
  { k: 'Container queries', motif: 'ok', a: 'no', b: 'ok', c: 'no' },
  { k: 'Pseudo-state props on every primitive', motif: 'ok', a: 'partial', b: 'no', c: 'no' },
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
  return <Box as="span">{v}</Box>;
}

export function Comparison() {
  return (
    <LandingSection>
      <SectionHeadCenter
        eye="Compared"
        title="Honest, side-by-side."
        sub="We like the libraries we're compared against. Use whichever fits your team — but here's how motif-js stacks up."
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
          gridTemplateColumns={{ base: '1.2fr 1fr 1fr', lg: '1.4fr 1fr 1fr 1fr 1fr' }}
          bg="$colors.surface.paper2"
          borderBottomStyle="solid"
          borderBottomWidth={1}
          borderBottomColor="$colors.line.faint"
        >
          <CompareHead>Feature</CompareHead>
          <CompareHead motif>
            <Sparkle width={14} height={14} /> motif-js
          </CompareHead>
          <CompareHead>styled-components</CompareHead>
          <CompareHead hideBelowLg>vanilla-extract</CompareHead>
          <CompareHead hideBelowLg last>
            CSS Modules
          </CompareHead>
        </Box>
        {rows.map((r, idx) => (
          <Box
            key={r.k}
            display="grid"
            gridTemplateColumns={{ base: '1.2fr 1fr 1fr', lg: '1.4fr 1fr 1fr 1fr 1fr' }}
            borderBottomStyle={idx === rows.length - 1 ? 'none' : 'solid'}
            borderBottomWidth={idx === rows.length - 1 ? 0 : 1}
            borderBottomColor="$colors.line.faint"
          >
            <CompareCell label>{r.k}</CompareCell>
            <CompareCell motif>{cellGlyph(r.motif)}</CompareCell>
            <CompareCell>{cellGlyph(r.a)}</CompareCell>
            <CompareCell hideBelowLg>{cellGlyph(r.b)}</CompareCell>
            <CompareCell hideBelowLg last>
              {cellGlyph(r.c)}
            </CompareCell>
          </Box>
        ))}
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
