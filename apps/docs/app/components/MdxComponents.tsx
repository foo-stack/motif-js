import type { MDXComponents } from 'mdx/types';
import { Blockquote, Box, Code, Heading, Kbd, Link, Paragraph } from '@motif-js/react';
import type { ComponentProps } from 'react';

/**
 * MDX → Motif primitive mapping.
 *
 * Every styled element rendered by MDX flows through one of these
 * components. Bare HTML tags do not appear in the output; they are
 * transformed by `MDXProvider` before reaching the DOM.
 *
 * Phase 2 of `DOC_PLAN.md` adds `CodeBlock` (Shiki) and the Callout
 * variants — for Phase 0, prose + headings + inline code is enough
 * to validate the pipeline.
 */
export const mdxComponents: MDXComponents = {
  h1: (props: ComponentProps<typeof Heading>) => <Heading level={1} {...props} />,
  h2: (props: ComponentProps<typeof Heading>) => <Heading level={2} {...props} />,
  h3: (props: ComponentProps<typeof Heading>) => <Heading level={3} {...props} />,
  h4: (props: ComponentProps<typeof Heading>) => <Heading level={4} {...props} />,
  p: (props: ComponentProps<typeof Paragraph>) => <Paragraph {...props} />,
  blockquote: (props: ComponentProps<typeof Blockquote>) => <Blockquote {...props} />,
  code: (props: ComponentProps<typeof Code>) => <Code {...props} />,
  kbd: (props: ComponentProps<typeof Kbd>) => <Kbd {...props} />,
  a: (props: ComponentProps<typeof Link>) => <Link {...props} />,
  // Wrap the article body in a constrained, readable column.
  wrapper: ({ children }) => (
    <Box
      as="main"
      maxWidth={720}
      mx="auto"
      px={{ base: '$5', md: '$6' }}
      py={{ base: '$10', md: '$16' }}
      bg="$colors.surface.base"
      color="$colors.text.default"
      fontFamily="$fonts.sans"
      fontSize="$fontSizes.md"
      lineHeight="$lineHeights.prose"
    >
      {children}
    </Box>
  ),
};
