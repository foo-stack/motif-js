'use client';

import type { MotifComponent } from '@usemotif/core';

import type { ReactElement, ReactNode } from 'react';
import { Box, type BoxProps } from './Box.js';
import { Text, type TextProps } from './Text.js';

/**
 * Heading — semantic h1–h6. The `level` prop drives both the rendered
 * tag (`as="h{level}"`) and a default font-size scale that maps each
 * level to a token. Style props from the user always override the
 * level defaults.
 */
export interface HeadingProps extends Omit<TextProps, 'as'> {
  /** 1–6. Defaults to 2. */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}
const headingSize = ['$3xl', '$2xl', '$xl', '$lg', '$md', '$sm'] as const;
export const Heading: MotifComponent<HeadingProps, ReactElement | null> = function ({
  level = 2,
  children,
  ...rest
}: HeadingProps): ReactElement {
  return (
    <Text
      as={`h${level}` as const}
      fontSize={headingSize[level - 1]!}
      fontWeight="$bold"
      lineHeight={1.2}
      mt={0}
      mb={0}
      {...rest}
    >
      {children}
    </Text>
  );
};

/**
 * Paragraph — semantic `<p>` with sensible defaults: medium font size,
 * 1.6 line-height, no enforced margin. Style props win.
 */
export interface ParagraphProps extends Omit<TextProps, 'as'> {}
export const Paragraph: MotifComponent<ParagraphProps, ReactElement | null> = function ({
  children,
  ...rest
}: ParagraphProps): ReactElement {
  return (
    <Text as="p" fontSize="$md" lineHeight={1.6} mt={0} mb={0} {...rest}>
      {children}
    </Text>
  );
};

/**
 * Code — inline `<code>` with monospace font and subtle background
 * tint. Use `<pre><Code>...</Code></pre>` (or pass `as="pre"` via
 * Text directly) for block code. Tone is neutral by default; tweak
 * `bg` / `color` for accent variants.
 */
export interface CodeProps extends Omit<TextProps, 'as'> {}
export const Code: MotifComponent<CodeProps, ReactElement | null> = function ({
  children,
  ...rest
}: CodeProps): ReactElement {
  return (
    <Text
      as="code"
      fontFamily="$mono"
      fontSize="$sm"
      bg="$colors.surface.muted"
      px="$1"
      py={0}
      borderRadius="$sm"
      {...rest}
    >
      {children}
    </Text>
  );
};

/**
 * Kbd — `<kbd>` for keyboard shortcut labels. Monospace, bordered,
 * slight elevation. Designed for inline use inside paragraphs.
 */
export interface KbdProps extends Omit<TextProps, 'as'> {}
export const Kbd: MotifComponent<KbdProps, ReactElement | null> = function ({
  children,
  ...rest
}: KbdProps): ReactElement {
  return (
    <Text
      as="kbd"
      fontFamily="$mono"
      fontSize="$sm"
      bg="$colors.surface.raised"
      color="$colors.text.default"
      borderWidth={1}
      borderStyle="solid"
      borderColor="$colors.border.default"
      borderRadius="$sm"
      px="$1.5"
      py={0}
      {...rest}
    >
      {children}
    </Text>
  );
};

/**
 * Blockquote — `<blockquote>` with a left accent border + italic
 * children-by-default. Pass `style={{ fontStyle: 'normal' }}` to disable
 * the italic if your design system prefers upright quoted text, and any
 * Box style prop to override the defaults.
 */
export interface BlockquoteProps extends Omit<BoxProps, 'as'> {
  children?: ReactNode;
  /** Optional citation rendered after the quote in muted text. */
  cite?: ReactNode;
}
export const Blockquote: MotifComponent<BlockquoteProps, ReactElement | null> = function ({
  children,
  cite,
  style,
  ...rest
}: BlockquoteProps): ReactElement {
  return (
    <Box
      as="blockquote"
      borderLeftWidth={4}
      borderLeftStyle="solid"
      borderLeftColor="$colors.border.default"
      pl="$4"
      pr="$2"
      py="$1"
      mt={0}
      mb={0}
      mx={0}
      // Italic by default; the consumer's `style` merges last so
      // `style={{ fontStyle: 'normal' }}` (the documented opt-out) wins.
      // `fontStyle` isn't part of the style-prop schema, hence inline `style`.
      style={{ fontStyle: 'italic', ...style }}
      {...rest}
    >
      <Text as="span" color="$colors.text.default">
        {children}
      </Text>
      {cite !== undefined && cite !== null ? (
        <Text as="cite" display="block" color="$colors.text.muted" fontSize="$sm" mt="$1">
          {cite}
        </Text>
      ) : null}
    </Box>
  );
};
