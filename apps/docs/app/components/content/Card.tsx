import type { ComponentProps, ReactNode } from 'react';
import { Box } from '@motif-js/react';
import { Link as RRLink } from 'react-router';

interface CardBaseProps {
  /** Optional accent corner — a small terracotta block in the
   * top-right corner that signals "this card is interactive / canonical". */
  accent?: boolean;
  /** Optional padding override — defaults to `$5` on every side. */
  p?: ComponentProps<typeof Box>['p'];
  children: ReactNode;
}

const baseStyle = {
  borderRadius: '$radii.lg',
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: '$colors.border.muted',
  bg: '$colors.surface.raised',
  position: 'relative',
  overflow: 'hidden',
} as const;

/**
 * Static card. Use `Card.Link` for the navigable variant.
 */
export function Card({ accent = false, p = '$5', children }: CardBaseProps) {
  return (
    <Box {...baseStyle} p={p}>
      {accent && <AccentCorner />}
      {children}
    </Box>
  );
}

interface CardLinkProps extends CardBaseProps {
  to: string;
}

function CardLink({ to, accent = false, p = '$5', children }: CardLinkProps) {
  return (
    <Box
      as={RRLink}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...({ to } as any)}
      {...baseStyle}
      p={p}
      display="block"
      color="$colors.text.default"
      textDecoration="none"
      transition={{ property: 'border-color, transform', duration: '$durations.ui' }}
      _hover={{ borderColor: '$colors.border.default' }}
      _focus={{ outline: '2px solid', outlineColor: '$colors.focusRing', outlineOffset: 2 }}
    >
      {accent && <AccentCorner />}
      {children}
    </Box>
  );
}

function AccentCorner() {
  return (
    <Box
      position="absolute"
      top={0}
      right={0}
      width={28}
      height={28}
      bg="$colors.accent"
      aria-hidden="true"
    />
  );
}

Card.Link = CardLink;
