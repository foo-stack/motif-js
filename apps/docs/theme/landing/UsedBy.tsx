'use client';

import { Box, keyframes } from 'usemotif';
import { useState } from 'react';
import { Sparkle } from './icons.js';

const tools = [
  'Vite',
  'Next.js',
  'Remix',
  'Astro',
  'Expo',
  'Metro',
  'React Native',
  'React Server Components',
  'Vitest',
  'Storybook',
  'TypeScript',
  'ESLint',
];

const all = [...tools, ...tools];

// Continuous translateX from 0 → -50% so the duplicated track tile loops
// seamlessly. Hover on the wrapping marquee pauses via React state +
// the AnimationObject's `playState` slot - that's the dogfood path for
// "parent hover affects child animation," since motif (1.4) doesn't
// model parent-hover-child selectors.
const scroll = keyframes({
  from: { transform: 'translateX(0)' },
  to: { transform: 'translateX(-50%)' },
});

const ITEM_AXES = { opsz: 36 } as const;

export function UsedBy() {
  const [paused, setPaused] = useState(false);

  return (
    <Box
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      borderTopStyle="solid"
      borderTopWidth={1}
      borderTopColor="$colors.line.faint"
      borderBottomStyle="solid"
      borderBottomWidth={1}
      borderBottomColor="$colors.line.faint"
      bg="$colors.surface.paper2"
      py={28}
      position="relative"
      overflow="hidden"
    >
      <Box
        textAlign="center"
        mb={18}
        fontFamily="$fontFamilies.mono"
        fontWeight={500}
        fontSize="11px"
        lineHeight={1}
        color="$colors.fg.faint"
        textTransform="uppercase"
        letterSpacing="0.14em"
      >
        Drops into the React ecosystem you already have
      </Box>
      <Box
        display="flex"
        gap={64}
        alignItems="center"
        animation={{
          name: scroll,
          duration: '50s',
          easing: 'linear',
          iterationCount: 'infinite',
          playState: paused ? 'paused' : 'running',
        }}
        style={{ width: 'max-content' }}
      >
        {all.map((name, i) => (
          <MarqueeItem key={`${name}-${i}`} name={name} />
        ))}
      </Box>
    </Box>
  );
}

function MarqueeItem({ name }: { name: string }) {
  return (
    <Box
      as="span"
      display="inline-flex"
      alignItems="center"
      gap={10}
      fontFamily="$fontFamilies.display"
      fontWeight={500}
      fontSize="22px"
      lineHeight={1}
      letterSpacing="-0.01em"
      color="$colors.fg.faint"
      opacity={0.7}
      transition="opacity 200ms"
      fontVariationSettings={ITEM_AXES}
      style={{ whiteSpace: 'nowrap' }}
      _hover={{ opacity: 1, color: '$colors.fg.strong' }}
    >
      <Sparkle /> {name}
    </Box>
  );
}
