import type { MDXComponents } from 'mdx/types';
import { Blockquote, Code, Heading, Kbd, Link, Paragraph } from '@motif-js/react';
import type { ComponentProps } from 'react';

/**
 * MDX → Motif primitive mapping.
 *
 * Every styled element rendered by MDX flows through one of these
 * components. Bare HTML tags do not appear in the output; they are
 * transformed by `MDXProvider` before reaching the DOM.
 *
 * The article column itself is laid out by `DocsLayout`, so the
 * provider stays focused on element-to-primitive mapping. `CodeBlock`
 * (Shiki) and the Callout variants land in Phase 2.
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
};
