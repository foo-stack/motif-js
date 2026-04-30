import type { MDXComponents } from 'mdx/types';
import { Box, Code, Heading, Kbd, Link, Paragraph } from '@motif-js/react';
import type { ComponentProps } from 'react';
import { CodeBlockShell } from './content/CodeBlockShell';
import { Callout } from './content/Callout';
import { Card } from './content/Card';
import { ArticleHeader, Eyebrow } from './content/ArticleHeader';
import { Sandbox } from './content/Sandbox';

/**
 * MDX → Motif primitive mapping.
 *
 * Every styled element rendered by MDX flows through one of these
 * components. Bare HTML tags do not appear in the output; they are
 * transformed by `MDXProvider` before reaching the DOM.
 *
 * The article column itself is laid out by `DocsLayout`, so the
 * provider stays focused on element-to-primitive mapping plus the
 * Phase-2 content components (`Callout`, `Card`, `ArticleHeader`).
 */
export const mdxComponents: MDXComponents = {
  h1: (props: ComponentProps<typeof Heading>) => <Heading level={1} {...props} />,
  h2: (props: ComponentProps<typeof Heading>) => (
    <Heading
      level={2}
      mt="$10"
      mb="$3"
      fontFamily="$fonts.display"
      fontSize={{ base: '$fontSizes.2xl', md: '$fontSizes.3xl' }}
      fontWeight="$fontWeights.semibold"
      letterSpacing="-0.01em"
      color="$colors.text.strong"
      lineHeight="$lineHeights.tight"
      {...props}
    />
  ),
  h3: (props: ComponentProps<typeof Heading>) => (
    <Heading
      level={3}
      mt="$8"
      mb="$2"
      fontFamily="$fonts.sans"
      fontSize="$fontSizes.xl"
      fontWeight="$fontWeights.semibold"
      color="$colors.text.strong"
      lineHeight="$lineHeights.snug"
      {...props}
    />
  ),
  h4: (props: ComponentProps<typeof Heading>) => (
    <Heading
      level={4}
      mt="$6"
      mb="$2"
      fontFamily="$fonts.sans"
      fontSize="$fontSizes.lg"
      fontWeight="$fontWeights.semibold"
      color="$colors.text.strong"
      {...props}
    />
  ),
  p: (props: ComponentProps<typeof Paragraph>) => (
    <Paragraph my="$3" lineHeight="$lineHeights.prose" {...props} />
  ),
  blockquote: (props: ComponentProps<typeof Box>) => (
    <Box
      as="blockquote"
      my="$5"
      pl="$5"
      py="$2"
      mx={0}
      borderLeftWidth={3}
      borderLeftStyle="solid"
      borderLeftColor="$colors.accent"
      color="$colors.text.muted"
      {...props}
    />
  ),
  code: (props: ComponentProps<typeof Code>) => (
    <Code
      px="$1"
      py={1}
      borderRadius="$radii.sm"
      bg="$colors.surface.muted"
      color="$colors.text.strong"
      fontFamily="$fonts.mono"
      fontSize="0.92em"
      {...props}
    />
  ),
  kbd: (props: ComponentProps<typeof Kbd>) => <Kbd {...props} />,
  a: (props: ComponentProps<typeof Link>) => (
    <Link color="$colors.accent" textDecoration="underline" {...props} />
  ),
  ul: (props: ComponentProps<typeof Box>) => (
    <Box as="ul" my="$3" pl="$5" lineHeight="$lineHeights.prose" {...props} />
  ),
  ol: (props: ComponentProps<typeof Box>) => (
    <Box as="ol" my="$3" pl="$5" lineHeight="$lineHeights.prose" {...props} />
  ),
  li: (props: ComponentProps<typeof Box>) => <Box as="li" my={2} {...props} />,
  hr: () => (
    <Box
      as="hr"
      my="$8"
      borderTopWidth={1}
      borderTopStyle="solid"
      borderTopColor="$colors.border.muted"
      borderRightWidth={0}
      borderBottomWidth={0}
      borderLeftWidth={0}
    />
  ),
  table: (props: ComponentProps<typeof Box>) => (
    <Box as="table" my="$5" width="100%" fontSize="$fontSizes.sm" {...props} />
  ),
  th: (props: ComponentProps<typeof Box>) => (
    <Box
      as="th"
      textAlign="left"
      px="$3"
      py="$2"
      borderBottomWidth={1}
      borderBottomStyle="solid"
      borderBottomColor="$colors.border.default"
      color="$colors.text.strong"
      fontWeight="$fontWeights.semibold"
      {...props}
    />
  ),
  td: (props: ComponentProps<typeof Box>) => (
    <Box
      as="td"
      px="$3"
      py="$2"
      borderBottomWidth={1}
      borderBottomStyle="solid"
      borderBottomColor="$colors.border.muted"
      color="$colors.text.default"
      {...props}
    />
  ),
  pre: CodeBlockShell,

  // Content components reachable from any MDX file via the provider —
  // no per-file imports needed.
  Callout,
  Card,
  ArticleHeader,
  Eyebrow,
  Sandbox,
};
