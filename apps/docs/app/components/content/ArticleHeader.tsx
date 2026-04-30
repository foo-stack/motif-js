import type { ReactNode } from 'react';
import { Box, HStack, Heading, Paragraph, Text, VStack } from '@motif-js/react';
import { Clock, FilePen, Globe } from '@motif-js/icons';

export interface ArticleHeaderMetaItem {
  readonly icon?: ReactNode;
  readonly label: string;
  readonly href?: string;
}

export interface ArticleHeaderProps {
  /** Small label above the title — section + read time, etc. */
  eyebrow?: string;
  /** The h1. */
  title: string;
  /** Optional supporting paragraph beneath the title. */
  lede?: string;
  /** Optional row beneath the lede — clock / edit-on-github / platform badges. */
  meta?: ReadonlyArray<ArticleHeaderMetaItem>;
}

/**
 * Reusable article-header block. Used at the top of every Tier-1 docs
 * page. The eyebrow + title + lede pattern matches the brand reference
 * design (`~/Downloads/Motif Documentation/Pages.jsx`'s `DocsArticle`).
 */
export function ArticleHeader({ eyebrow, title, lede, meta }: ArticleHeaderProps) {
  return (
    <VStack as="header" alignItems="stretch" gap="$3" mb="$8">
      {eyebrow !== undefined && <Eyebrow>{eyebrow}</Eyebrow>}
      <Heading
        level={1}
        fontFamily="$fonts.display"
        fontWeight="$fontWeights.semibold"
        fontSize={{ base: '$fontSizes.3xl', md: '$fontSizes.4xl' }}
        lineHeight="$lineHeights.tight"
        letterSpacing="-0.02em"
        color="$colors.text.strong"
      >
        {title}
      </Heading>
      {lede !== undefined && (
        <Paragraph
          fontSize={{ base: '$fontSizes.md', md: '$fontSizes.lg' }}
          lineHeight="$lineHeights.normal"
          color="$colors.text.muted"
          maxWidth={620}
        >
          {lede}
        </Paragraph>
      )}
      {meta !== undefined && meta.length > 0 && (
        <HStack
          gap="$5"
          flexWrap="wrap"
          pt="$3"
          color="$colors.text.faint"
          fontSize="$fontSizes.sm"
        >
          {meta.map((item) => (
            <MetaItem key={item.label} item={item} />
          ))}
        </HStack>
      )}
    </VStack>
  );
}

/**
 * Bare eyebrow — small uppercase label. Used by ArticleHeader, the
 * sidebar, and the sidebar/footer column titles. Exporting it for
 * direct use inside MDX too.
 */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <HStack alignItems="center" gap="$2">
      <Box width={6} height={6} borderRadius="$radii.full" bg="$colors.accent" aria-hidden="true" />
      <Text
        as="span"
        fontFamily="$fonts.sans"
        fontSize="$fontSizes.2xs"
        fontWeight="$fontWeights.semibold"
        color="$colors.text.faint"
        textTransform="uppercase"
        letterSpacing="0.08em"
      >
        {children}
      </Text>
    </HStack>
  );
}

function MetaItem({ item }: { item: ArticleHeaderMetaItem }) {
  const inner = (
    <HStack alignItems="center" gap="$2">
      {item.icon !== undefined && (
        <Box display="inline-flex" fontSize={14} aria-hidden="true">
          {item.icon}
        </Box>
      )}
      <Text as="span">{item.label}</Text>
    </HStack>
  );
  if (item.href === undefined) return inner;
  return (
    <Box
      as="a"
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...({ href: item.href, target: '_blank', rel: 'noreferrer' } as any)}
      color="$colors.text.faint"
      textDecoration="none"
      _hover={{ color: '$colors.text.muted' }}
    >
      {inner}
    </Box>
  );
}

/**
 * Convenience: render-ready icons for the most common meta-row items.
 * Saves callers from importing the Lucide glyphs themselves.
 */
export const articleMetaIcons = {
  clock: <Clock />,
  edit: <FilePen />,
  platform: <Globe />,
} as const;
