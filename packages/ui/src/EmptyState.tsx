import type { ReactNode } from 'react';
import { Box, Text } from 'usemotif';

export interface EmptyStateProps {
  /** Optional leading glyph / illustration (inherits the muted colour). */
  readonly icon?: ReactNode;
  /** Headline line. */
  readonly title: ReactNode;
  /** Supporting copy under the title. */
  readonly description?: ReactNode;
  /** Action area — e.g. a `<Button>` to resolve the empty state. */
  readonly action?: ReactNode;
}

/**
 * A themed empty / zero-data placeholder — a centered column with an optional
 * icon, a title, supporting copy, and an action slot. Pure presentational
 * (Box + Text, no headless), so it hugs the display floor.
 *
 * ```tsx
 * <EmptyState
 *   icon={<InboxIcon />}
 *   title="No messages yet"
 *   description="When someone writes to you, it'll show up here."
 *   action={<Button>Compose</Button>}
 * />
 * ```
 */
export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      textAlign="center"
      gap="$space.3"
      px="$space.6"
      py="$space.6"
    >
      {icon !== undefined ? (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          color="$colors.text.muted"
          fontSize="$fontSizes.xl"
        >
          {icon}
        </Box>
      ) : null}
      <Box display="flex" flexDirection="column" alignItems="center" gap="$space.1">
        <Text fontSize="$fontSizes.lg" fontWeight="$fontWeights.semibold" color="$colors.text.default">
          {title}
        </Text>
        {description !== undefined ? (
          <Text fontSize="$fontSizes.sm" color="$colors.text.muted" maxWidth={420}>
            {description}
          </Text>
        ) : null}
      </Box>
      {action !== undefined ? <Box mt="$space.2">{action}</Box> : null}
    </Box>
  );
}
