'use client';

import { useRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import { Box } from '@motif-js/react';
import { CopyButton } from './CopyButton';

export type CodeBlockShellProps = ComponentPropsWithoutRef<'pre'>;

/**
 * Wraps the `<pre>` emitted by rehype-shiki with brand styling +
 * a copy button. The Shiki classes on the inner `<pre>` carry
 * through (we only swap the outer presentation), so the
 * `app/styles/code.css` selectors continue to fire and the per-token
 * color CSS variables keep resolving against the active theme.
 *
 * The MDX provider wires this to the `pre` slot — every fenced code
 * block in an `.mdx` file ends up here.
 */
export function CodeBlockShell({ className, children, ...rest }: CodeBlockShellProps) {
  const innerRef = useRef<HTMLPreElement | null>(null);
  const getText = () => innerRef.current?.textContent ?? '';

  return (
    <Box
      position="relative"
      my="$5"
      borderWidth={1}
      borderStyle="solid"
      borderColor="$colors.border.muted"
      borderRadius="$radii.lg"
      bg="$colors.surface.muted"
      overflow="hidden"
    >
      <CopyButton getText={getText} />
      <Box overflowX="auto">
        <Box
          as="pre"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          {...({ ref: innerRef, className, tabIndex: 0, ...rest } as any)}
          fontFamily="$fonts.mono"
          fontSize="$fontSizes.sm"
          lineHeight={1.6}
          color="$colors.text.default"
          py="$4"
          px="$5"
          m={0}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}

/**
 * Inline `<code>` rendered inside MDX prose (the bare ` `code` ` form,
 * not fenced blocks). Defers to Motif's `Code` for the visual baseline
 * but keeps the wrapper here so we can layer additional rules later
 * (token tints, copyable inline samples, etc.) without touching the
 * core primitive.
 */
export { Code as InlineCode } from '@motif-js/react';
