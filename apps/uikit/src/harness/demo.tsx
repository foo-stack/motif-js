import { Box, Text } from 'usemotif';
import type { ReactNode } from 'react';

/**
 * A labelled filler tile for layout-primitive demos — gives the structural
 * components (Stack, Grid, Flex, …) visible children without each story
 * re-inventing a coloured box.
 */
export function Tile({
  children,
  tone = 'primary',
  ...rest
}: {
  children?: ReactNode;
  tone?: 'primary' | 'muted' | 'success' | 'danger';
} & Record<string, unknown>) {
  const bg =
    tone === 'muted' ? '$colors.surface.raised' : `$colors.action.${tone}.bg`;
  const fg = tone === 'muted' ? '$colors.text.default' : `$colors.action.${tone}.fg`;
  return (
    <Box
      bg={bg}
      color={fg}
      px="$3"
      py="$2"
      borderRadius="$sm"
      display="flex"
      alignItems="center"
      justifyContent="center"
      fontWeight="$semibold"
      fontSize="$sm"
      {...rest}
    >
      {children}
    </Box>
  );
}

/** Section caption used across layout stories. */
export function Note({ children }: { children: ReactNode }) {
  return (
    <Text fontSize="$sm" color="$colors.text.muted" mt={0} mb="$2">
      {children}
    </Text>
  );
}
