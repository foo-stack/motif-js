'use client';

import { type ReactElement, type ReactNode, useState } from 'react';
import { Box } from './Box.js';
import { Text } from './Text.js';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;

export interface AvatarProps {
  /** Image source URL. When absent / fails to load, falls back to
   * initials (or the explicit `fallback` ReactNode). */
  src?: string;
  /** Required label — used as `alt` text when an image renders, and
   * as the source of the initials fallback. */
  name: string;
  /** Optional override for the fallback content. Wins over the
   * generated initials. */
  fallback?: ReactNode;
  size?: AvatarSize;
  /** Shape — `'circle'` (default) or `'square'` (rounded square). */
  shape?: 'circle' | 'square';
}

const SIZE_PX: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
};

/**
 * Compute up-to-2-letter initials from a name. "Jane Doe" → "JD";
 * "anil" → "AN"; trims punctuation. Used as the default fallback
 * when no `src` is provided or the image fails to load.
 */
function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) {
    const word = parts[0]!;
    return word.slice(0, 2).toUpperCase();
  }
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

/**
 * Avatar — circular (or rounded-square) profile image with an
 * automatic initials fallback when `src` is absent or fails. The
 * `name` prop drives both the image's `alt` text and the fallback
 * initials, keeping a11y consistent across both states.
 */
export function Avatar({
  src,
  name,
  fallback,
  size = 'md',
  shape = 'circle',
}: AvatarProps): ReactElement {
  const px = typeof size === 'number' ? size : SIZE_PX[size];
  // Track *which* src failed rather than a boolean, so a new `src` is
  // re-attempted automatically — a boolean stayed `true` across src
  // changes and kept showing initials even after a valid src arrived.
  const [erroredSrc, setErroredSrc] = useState<string | undefined>(undefined);
  const radius = shape === 'circle' ? '$full' : '$md';
  const showImage = src !== undefined && erroredSrc !== src;

  return (
    <Box
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      w={px}
      h={px}
      borderRadius={radius}
      bg="$colors.surface.muted"
      color="$colors.text.default"
      fontWeight="$semibold"
      fontSize={Math.round(px * 0.4)}
      overflow="hidden"
      style={{ userSelect: 'none' }}
    >
      {showImage ? (
        <img
          src={src}
          alt={name}
          width={px}
          height={px}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={() => setErroredSrc(src)}
        />
      ) : (
        <Text as="span">{fallback ?? initialsFor(name)}</Text>
      )}
    </Box>
  );
}
