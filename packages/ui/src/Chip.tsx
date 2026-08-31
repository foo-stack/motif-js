'use client';

import type { ReactNode } from 'react';
import { Box, type BoxProps } from 'usemotif';

export type ChipIntent = 'neutral' | 'primary';

export interface ChipProps {
  readonly children?: ReactNode;
  /** Optional leading glyph. */
  readonly icon?: ReactNode;
  /** Tone. Default `neutral`. */
  readonly intent?: ChipIntent;
  /** When provided, renders a `×` button that calls this. */
  readonly onRemove?: () => void;
}

const INTENT_BG = {
  neutral: '$colors.surface.muted',
  primary: '$colors.action.primary.bg',
} as const;
const INTENT_FG = {
  neutral: '$colors.text.default',
  primary: '$colors.text.inverse',
} as const;
const REMOVE_HOVER = { opacity: 0.65 } as const;

/**
 * A themed compact tag / pill - like a `Badge`, but built for input affordances:
 * an optional leading icon and an optional `×` remove button. Pure presentational
 * (Box, no headless), so it hugs the display floor.
 *
 * ```tsx
 * <Chip onRemove={() => remove('react')}>React</Chip>
 * <Chip intent="primary" icon={<TagIcon />}>Featured</Chip>
 * ```
 */
export function Chip({ children, icon, intent = 'neutral', onRemove }: ChipProps) {
  return (
    <Box
      display="inline-flex"
      alignItems="center"
      gap="$space.1"
      pl={icon !== undefined ? '$space.2' : '$space.3'}
      pr={onRemove !== undefined ? '$space.1' : '$space.3'}
      py="$space.1"
      borderRadius="$radii.full"
      fontSize="$fontSizes.sm"
      bg={INTENT_BG[intent]}
      color={INTENT_FG[intent]}
    >
      {icon !== undefined ? (
        <Box as="span" display="inline-flex" alignItems="center">
          {icon}
        </Box>
      ) : null}
      <Box as="span">{children}</Box>
      {onRemove !== undefined ? (
        <Box
          as="button"
          display="inline-flex"
          alignItems="center"
          justifyContent="center"
          w={18}
          h={18}
          borderWidth={0}
          borderRadius="$radii.full"
          bg="transparent"
          color="currentColor"
          cursor="pointer"
          _hover={REMOVE_HOVER}
          onClick={onRemove}
          aria-label="Remove"
          {...({ type: 'button' } as unknown as BoxProps)}
        >
          ×
        </Box>
      ) : null}
    </Box>
  );
}
