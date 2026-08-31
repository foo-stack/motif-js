import type { ReactNode } from 'react';
import { Box, Text } from 'usemotif';

export type TimelineStatus = 'default' | 'success' | 'warning' | 'danger';

export interface TimelineItem {
  readonly id: string;
  /** Event headline. */
  readonly title: ReactNode;
  /** Supporting detail under the title. */
  readonly description?: ReactNode;
  /** Timestamp / meta shown beside the title. */
  readonly time?: ReactNode;
  /** Marker tone - `default` uses the primary accent; the rest use status tokens. */
  readonly status?: TimelineStatus;
}

export interface TimelineProps {
  readonly items: ReadonlyArray<TimelineItem>;
}

/**
 * A themed vertical timeline - a marker dot + connector line per event, with a
 * title, optional timestamp, and detail. Pure presentational (Box + Text, no
 * headless), so it hugs the display floor.
 *
 * ```tsx
 * <Timeline
 *   items={[
 *     { id: 'a', title: 'Order placed', time: '09:30', status: 'success' },
 *     { id: 'b', title: 'Out for delivery', time: '14:10' },
 *   ]}
 * />
 * ```
 */
export function Timeline({ items }: TimelineProps) {
  return (
    <Box display="flex" flexDirection="column">
      {items.map((item, i) => {
        const last = i === items.length - 1;
        const dotColor =
          item.status !== undefined && item.status !== 'default'
            ? `$colors.status.${item.status}.fg`
            : '$colors.action.primary.bg';
        return (
          <Box key={item.id} display="flex" flexDirection="row" gap="$space.3">
            {/* Marker column: a dot, then a connector line to the next event. */}
            <Box display="flex" flexDirection="column" alignItems="center">
              <Box
                width={12}
                height={12}
                mt={4}
                flexShrink={0}
                borderRadius="$radii.full"
                bg={dotColor}
              />
              {!last ? (
                <Box width={2} flexGrow={1} minHeight={16} mt={2} bg="$colors.border.default" />
              ) : null}
            </Box>
            <Box display="flex" flexDirection="column" gap="$space.1" pb={last ? 0 : '$space.4'}>
              <Box display="flex" flexDirection="row" alignItems="baseline" gap="$space.2">
                <Text fontWeight="$fontWeights.semibold" color="$colors.text.default">
                  {item.title}
                </Text>
                {item.time !== undefined ? (
                  <Text fontSize="$fontSizes.sm" color="$colors.text.muted">
                    {item.time}
                  </Text>
                ) : null}
              </Box>
              {item.description !== undefined ? (
                <Text fontSize="$fontSizes.sm" color="$colors.text.muted">
                  {item.description}
                </Text>
              ) : null}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
