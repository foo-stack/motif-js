import type { MotifComponent } from '@usemotif/core';
import type { ReactElement, ReactNode } from 'react';
import { Box } from './Box.js';
import { Text, type TextProps } from './Text.js';

/**
 * Native typography primitives. RN doesn't ship semantic HTML tags;
 * everything renders through `<Text>` (or `<View>` when block-level
 * structure matters). The visual differences come from per-primitive
 * default style props — same defaults as the web implementations so
 * cross-platform code looks the same.
 */

export interface HeadingProps extends TextProps {
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
      fontSize={headingSize[level - 1]!}
      fontWeight="$bold"
      lineHeight={1.2}
      accessibilityRole="header"
      {...rest}
    >
      {children}
    </Text>
  );
};

export interface ParagraphProps extends TextProps {}
export const Paragraph: MotifComponent<ParagraphProps, ReactElement | null> = function ({
  children,
  ...rest
}: ParagraphProps): ReactElement {
  return (
    <Text fontSize="$md" lineHeight={1.6} {...rest}>
      {children}
    </Text>
  );
};

export interface CodeProps extends TextProps {}
export const Code: MotifComponent<CodeProps, ReactElement | null> = function ({
  children,
  ...rest
}: CodeProps): ReactElement {
  return (
    <Text
      fontFamily="$mono"
      fontSize="$sm"
      bg="$colors.surface.muted"
      px="$1"
      borderRadius="$sm"
      {...rest}
    >
      {children}
    </Text>
  );
};

export interface KbdProps extends TextProps {}
export const Kbd: MotifComponent<KbdProps, ReactElement | null> = function ({
  children,
  ...rest
}: KbdProps): ReactElement {
  return (
    <Text
      fontFamily="$mono"
      fontSize="$sm"
      bg="$colors.surface.raised"
      color="$colors.text.default"
      borderWidth={1}
      borderStyle="solid"
      borderColor="$colors.border.default"
      borderRadius="$sm"
      px="$1.5"
      {...rest}
    >
      {children}
    </Text>
  );
};

export interface BlockquoteProps {
  children?: ReactNode;
  cite?: ReactNode;
}
export function Blockquote({ children, cite }: BlockquoteProps): ReactElement {
  return (
    <Box
      borderLeftWidth={4}
      borderLeftStyle="solid"
      borderLeftColor="$colors.border.default"
      pl="$4"
      pr="$2"
      py="$1"
    >
      <Text color="$colors.text.default" style={{ fontStyle: 'italic' }}>
        {children}
      </Text>
      {cite !== undefined && cite !== null ? (
        <Text color="$colors.text.muted" fontSize="$sm" mt="$1">
          {cite}
        </Text>
      ) : null}
    </Box>
  );
}
