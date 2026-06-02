import { type ReactElement, type ReactNode, useState } from 'react';
import { Box } from './Box.js';
import { Image } from './Image.js';
import { Text } from './Text.js';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;

export interface AvatarProps {
  src?: string;
  name: string;
  fallback?: ReactNode;
  size?: AvatarSize;
  shape?: 'circle' | 'square';
}

const SIZE_PX: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
};

function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

export function Avatar({
  src,
  name,
  fallback,
  size = 'md',
  shape = 'circle',
}: AvatarProps): ReactElement {
  const px = typeof size === 'number' ? size : SIZE_PX[size];
  // Track which src failed rather than a one-way boolean: a bare `errored`
  // flag never resets, so once any src failed a later valid `src` would
  // stay stuck on the initials fallback. Keying on the failed src lets a
  // new src retry.
  const [erroredSrc, setErroredSrc] = useState<string | undefined>(undefined);
  const radius = shape === 'circle' ? px / 2 : 8;
  const showImage = src !== undefined && erroredSrc !== src;

  return (
    <Box
      alignItems="center"
      justifyContent="center"
      w={px}
      h={px}
      borderRadius={radius}
      bg="$colors.surface.muted"
      overflow="hidden"
    >
      {showImage ? (
        <Image
          src={src}
          alt={name}
          w="$full"
          h="$full"
          style={{ width: px, height: px }}
          onError={() => setErroredSrc(src)}
        />
      ) : (
        <Text fontWeight="$semibold" fontSize={Math.round(px * 0.4)}>
          {fallback ?? initialsFor(name)}
        </Text>
      )}
    </Box>
  );
}
