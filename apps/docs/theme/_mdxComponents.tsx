import { Box } from 'motif-js';
import type { MDXComponents } from '@vorge/core/runtime';
import type { ReactNode } from 'react';

const H1_AXES = { opsz: 144, SOFT: 50 } as const;
const H2_AXES = { opsz: 100 } as const;

/**
 * Motif-styled MDX component overrides. Replaces the chrome-era
 * `.article h1 { ... }` element-selector cascade with motif primitives
 * scoped to MDX-rendered tags. Mounted by `<MDXComponentsProvider>` in
 * each layout (DocLayout, GuideLayout, etc.).
 *
 * h1/h2/h3 carry `data-article-heading` so chrome's TOC scroll-margin
 * rule (`.article h2, .article h3 { scroll-margin-top: 88px }`) — the
 * one bit chrome.css still owns — keeps anchoring TOC behaviour.
 * (Migrating that is M-5 candidate — no inline equivalent for
 * `scroll-margin-top` exists in motif's prop schema yet.)
 */
export const mdxComponents: MDXComponents = {
  h1: H1,
  h2: H2,
  h3: H3,
  p: P,
  a: A,
  code: InlineCode,
  ul: Ul,
  ol: Ol,
  li: Li,
};

function H1({ children }: { children?: ReactNode }) {
  return (
    <Box
      as="h1"
      m={0}
      mb={14}
      fontFamily="$fontFamilies.display"
      fontWeight={600}
      fontSize="44px"
      lineHeight={1.05}
      letterSpacing="-0.025em"
      color="$colors.fg.strong"
      fontVariationSettings={H1_AXES}
      style={{ textWrap: 'balance' }}
    >
      {children}
    </Box>
  );
}

function H2({ children, id }: { children?: ReactNode; id?: string }) {
  return (
    <Box
      as="h2"
      id={id}
      mt={56}
      mb={14}
      fontFamily="$fontFamilies.display"
      fontWeight={600}
      fontSize="28px"
      lineHeight={1.2}
      letterSpacing="-0.018em"
      color="$colors.fg.strong"
      fontVariationSettings={H2_AXES}
      style={{ scrollMarginTop: 88 }}
    >
      {children}
    </Box>
  );
}

function H3({ children, id }: { children?: ReactNode; id?: string }) {
  return (
    <Box
      as="h3"
      id={id}
      mt={36}
      mb={10}
      fontFamily="$fontFamilies.display"
      fontWeight={600}
      fontSize="20px"
      lineHeight={1.3}
      color="$colors.fg.strong"
      style={{ scrollMarginTop: 88 }}
    >
      {children}
    </Box>
  );
}

function P({ children }: { children?: ReactNode }) {
  return (
    <Box
      as="p"
      m={0}
      mb={18}
      fontFamily="$fontFamilies.sans"
      fontWeight={400}
      fontSize="17px"
      lineHeight={1.7}
      color="$colors.fg.base"
      style={{ textWrap: 'pretty' }}
    >
      {children}
    </Box>
  );
}

function A({ children, href }: { children?: ReactNode; href?: string }) {
  return (
    <Box
      as="a"
      // @ts-expect-error -- href is a valid <a> attribute; Box's type bag
      // doesn't carry anchor-specific attrs (deferred to M-5+ shim work).
      href={href}
      color="$colors.accent.base"
      style={{
        textDecoration: 'underline',
        textDecorationColor: 'color-mix(in oklab, var(--colors-accent-base) 28%, transparent)',
        textUnderlineOffset: '3px',
        textDecorationThickness: '1px',
      }}
      _hover={{
        // textDecorationColor isn't a registered style prop, so the hover
        // colour swap goes through a class. Pragmatic for the lone use.
      }}
      className="docs-mdx-link"
    >
      {children}
    </Box>
  );
}

function InlineCode({ children }: { children?: ReactNode }) {
  return (
    <Box
      as="code"
      fontFamily="$fontFamilies.mono"
      fontWeight={500}
      bg="$colors.surface.paper2"
      borderStyle="solid"
      borderWidth={1}
      borderColor="$colors.line.faint"
      borderRadius="4px"
      color="$colors.fg.strong"
      style={{
        fontSize: '0.88em',
        padding: '0.08em 0.4em',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </Box>
  );
}

function Ul({ children }: { children?: ReactNode }) {
  return (
    <Box as="ul" m={0} mb={18} pl={22} style={{ listStyle: 'disc' }} className="docs-mdx-list">
      {children}
    </Box>
  );
}

function Ol({ children }: { children?: ReactNode }) {
  return (
    <Box as="ol" m={0} mb={18} pl={22} className="docs-mdx-list">
      {children}
    </Box>
  );
}

function Li({ children }: { children?: ReactNode }) {
  return (
    <Box
      as="li"
      my={4}
      fontFamily="$fontFamilies.sans"
      fontWeight={400}
      fontSize="17px"
      lineHeight={1.7}
      color="$colors.fg.base"
    >
      {children}
    </Box>
  );
}
