'use client';

import { Box } from 'motif-js';
import type { ReactNode } from 'react';
import { Anchor } from './chrome/Anchor.js';

const TITLE_AXES = { opsz: 144, SOFT: 60 } as const;
const TITLE_EM_AXES = { opsz: 144, SOFT: 100 } as const;

/**
 * /404 surface components. Used by `apps/docs/content/404.mdx`.
 * Layout `'404'` wraps the rendered MDX in `<NotFoundShell>`.
 */
export function NotFoundShell({ children }: { children: ReactNode }) {
  return (
    <Box
      as="main"
      display="flex"
      alignItems="center"
      justifyContent="center"
      py={80}
      px={32}
      style={{ minHeight: 'calc(100vh - 240px)' }}
    >
      <Box maxW={720} w="100%">
        {children}
      </Box>
    </Box>
  );
}

export function NotFoundEye({ children }: { children: ReactNode }) {
  return (
    <Box
      as="span"
      display="inline-block"
      mb={14}
      fontFamily="$fontFamilies.mono"
      fontWeight={500}
      fontSize="11px"
      lineHeight={1}
      textTransform="uppercase"
      letterSpacing="0.16em"
      color="$colors.accent.base"
    >
      {children}
    </Box>
  );
}

export function NotFoundTitle({ children }: { children: ReactNode }) {
  return (
    <Box
      as="h1"
      m={0}
      mb={18}
      fontFamily="$fontFamilies.display"
      fontWeight={500}
      lineHeight={1.04}
      letterSpacing="-0.025em"
      color="$colors.fg.strong"
      fontVariationSettings={TITLE_AXES}
      style={{ fontSize: 'clamp(40px, 6vw, 64px)' }}
    >
      {children}
    </Box>
  );
}

export function NotFoundEm({ children }: { children: ReactNode }) {
  return (
    <Box
      as="em"
      color="$colors.accent.base"
      fontVariationSettings={TITLE_EM_AXES}
      style={{ fontStyle: 'italic' }}
    >
      {children}
    </Box>
  );
}

export function NotFoundLede({ children }: { children: ReactNode }) {
  return (
    <Box
      as="p"
      m={0}
      mb={28}
      maxW={540}
      fontFamily="$fontFamilies.sans"
      fontSize="18px"
      lineHeight={1.55}
      color="$colors.fg.muted"
    >
      {children}
    </Box>
  );
}

export function NotFoundCta({ children }: { children: ReactNode }) {
  return (
    <Box display="flex" gap={10} flexWrap="wrap" mb={40}>
      {children}
    </Box>
  );
}

export function NotFoundLinks({ children }: { children: ReactNode }) {
  return (
    <Box
      as="ul"
      m={0}
      p={0}
      display="grid"
      gridTemplateColumns={{ base: 'minmax(0, 1fr)', sm: 'repeat(2, minmax(0, 1fr))' }}
      gap={12}
      style={{ listStyle: 'none' }}
    >
      {children}
    </Box>
  );
}

export interface NotFoundLinkCardProps {
  href: string;
  eye: string;
  title: string;
  sub: string;
}

export function NotFoundLinkCard({ href, eye, title, sub }: NotFoundLinkCardProps) {
  return (
    <Box as="li" style={{ listStyle: 'none' }}>
      <Anchor
        href={href}
        display="block"
        py={18}
        px={20}
        borderStyle="solid"
        borderWidth={1}
        borderColor="$colors.line.base"
        borderRadius="10px"
        bg="$colors.surface.paper"
        color="$colors.fg.base"
        transition="border-color 160ms ease, transform 160ms ease"
        style={{ textDecoration: 'none' }}
        _hover={{ borderColor: '$colors.accent.base', transform: 'translateY(-1px)' }}
      >
        <Box
          as="span"
          display="block"
          mb="6px"
          fontFamily="$fontFamilies.mono"
          fontSize="11px"
          letterSpacing="0.14em"
          textTransform="uppercase"
          color="$colors.fg.muted"
        >
          {eye}
        </Box>
        <Box
          as="span"
          display="block"
          mb={4}
          fontFamily="$fontFamilies.display"
          fontWeight={600}
          fontSize="17px"
          letterSpacing="-0.01em"
          color="$colors.fg.strong"
        >
          {title}
        </Box>
        <Box
          as="span"
          display="block"
          fontFamily="$fontFamilies.sans"
          fontSize="13.5px"
          lineHeight={1.45}
          color="$colors.fg.muted"
        >
          {sub}
        </Box>
      </Anchor>
    </Box>
  );
}

export function KbdInline({ children }: { children: ReactNode }) {
  return (
    <Box as="span" display="inline-flex" gap="2px" ml={8}>
      {children}
    </Box>
  );
}
