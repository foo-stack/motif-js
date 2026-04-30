'use client';

import { useRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import { Box, HStack, Text } from '@motif-js/react';
import { CopyButton } from './CopyButton';

export type CodeBlockShellProps = ComponentPropsWithoutRef<'pre'> & {
  /** Lifted from the fenced-block metastring by the rehype-shiki
   *  `parseMetaString` hook in `vite.config.ts`. When set, renders
   *  as a small file-tab header above the code area.
   *
   *  hast-util-to-jsx-runtime drops the `data-` prefix when bridging
   *  HAST properties to React props, so the prop name on the React
   *  side is `filename`. We accept both forms defensively. */
  'data-filename'?: string;
  filename?: string;
};

/**
 * Wraps the `<pre>` emitted by rehype-shiki with brand styling +
 * a copy button + an optional filename header. The Shiki classes on
 * the inner `<pre>` carry through (we only swap the outer
 * presentation), so the `app/styles/code.css` selectors continue to
 * fire and the per-token color CSS variables keep resolving against
 * the active theme.
 *
 * The MDX provider wires this to the `pre` slot — every fenced code
 * block in an `.mdx` file ends up here.
 */
export function CodeBlockShell(props: CodeBlockShellProps) {
  const { className, children, ...rest } = props;
  const filename = props['data-filename'] ?? props.filename;
  // Strip the meta attrs from the spread we forward to the inner
  // <pre> — they are presentational only and have no business
  // landing on the DOM element.
  const innerProps = { ...rest };
  delete innerProps['data-filename'];
  delete innerProps.filename;

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
      {filename !== undefined && filename.length > 0 ? (
        <HStack
          alignItems="center"
          gap="$2"
          px="$4"
          py="$2"
          borderBottomWidth={1}
          borderBottomStyle="solid"
          borderBottomColor="$colors.border.muted"
          bg="$colors.surface.sunken"
        >
          <Box
            width={8}
            height={8}
            borderRadius="$radii.full"
            bg="$colors.accent"
            aria-hidden="true"
          />
          <Text
            as="span"
            fontFamily="$fonts.mono"
            fontSize="$fontSizes.xs"
            color="$colors.text.muted"
          >
            {filename}
          </Text>
        </HStack>
      ) : null}
      <CopyButton getText={getText} />
      <Box overflowX="auto">
        <Box
          as="pre"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          {...({ ref: innerRef, className, tabIndex: 0, ...innerProps } as any)}
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
