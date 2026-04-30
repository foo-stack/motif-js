import { Box, HStack, Svg, Text } from '@motif-js/react';

export interface LockupProps {
  /** Visual size in pixels. Drives the monogram bbox + wordmark size. */
  size?: 'sm' | 'md';
}

/**
 * Motif lockup — outlined monogram + Fraunces wordmark. Inherits color
 * from `currentColor`, so callers control tint via `color="$..."` on
 * the parent Text/Box.
 */
export function Lockup({ size = 'md' }: LockupProps) {
  const monogramPx = size === 'sm' ? 22 : 26;
  const wordmarkSize = size === 'sm' ? '$fontSizes.lg' : '$fontSizes.xl';

  return (
    <HStack alignItems="center" gap="$2">
      <Svg viewBox="0 0 64 64" width={monogramPx} height={monogramPx} fill="none">
        <rect
          x="1"
          y="1"
          width="62"
          height="62"
          rx="10"
          stroke="currentColor"
          strokeWidth={1.5}
          fill="none"
        />
        <path
          d="M14 46 L14 18 L22 18 L32 36 L42 18 L50 18 L50 46"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="32" cy="36" r="2" fill="currentColor" />
      </Svg>
      <Text
        as="span"
        fontFamily="$fonts.display"
        fontSize={wordmarkSize}
        fontWeight="$fontWeights.semibold"
        letterSpacing="-0.02em"
        lineHeight="$lineHeights.tight"
      >
        Motif
      </Text>
    </HStack>
  );
}

/**
 * Compact monogram-only lockup for very tight spots (mobile collapsed
 * nav, footer favicon-style usage).
 */
export function Monogram({ size = 22 }: { size?: number }) {
  return (
    <Box display="inline-block">
      <Svg viewBox="0 0 64 64" width={size} height={size} fill="none">
        <rect
          x="1"
          y="1"
          width="62"
          height="62"
          rx="10"
          stroke="currentColor"
          strokeWidth={1.5}
          fill="none"
        />
        <path
          d="M14 46 L14 18 L22 18 L32 36 L42 18 L50 18 L50 46"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="32" cy="36" r="2" fill="currentColor" />
      </Svg>
    </Box>
  );
}
