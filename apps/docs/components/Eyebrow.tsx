import { Box } from '@motif-js/react';
import type { ReactNode } from 'react';

export interface EyebrowProps {
  children: ReactNode;
  dot?: boolean;
}

export function Eyebrow({ children, dot = true }: EyebrowProps) {
  return (
    <Box
      as="span"
      display="inline-flex"
      alignItems="center"
      gap={8}
      mb={16}
      fontFamily="$fontFamilies.mono"
      fontWeight={500}
      fontSize="11px"
      lineHeight={1}
      textTransform="uppercase"
      letterSpacing="0.12em"
      color="$colors.fg.faint"
    >
      {dot ? (
        <Box as="span" aria-hidden="true" w={4} h={4} borderRadius="50%" bg="$colors.accent.base" />
      ) : null}
      {children}
    </Box>
  );
}
