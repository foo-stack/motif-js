import type { ReactNode } from 'react';
import { Box, Text } from 'usemotif';

export type AlertIntent = 'neutral' | 'info' | 'success' | 'danger';

const ACCENT: Record<AlertIntent, string> = {
  neutral: '$colors.border.strong',
  info: '$colors.action.primary.bg',
  success: '$colors.action.success.bg',
  danger: '$colors.action.danger.bg',
};

export interface AlertProps {
  /** Tone — drives the border + title colour. Default `neutral`. */
  readonly intent?: AlertIntent;
  /** Bold heading line. */
  readonly title?: ReactNode;
  /** Optional leading icon. */
  readonly icon?: ReactNode;
  /** Body content. */
  readonly children?: ReactNode;
}

/**
 * A themed message box — a muted surface with an intent-coloured border and
 * title, an optional icon, and body copy. Colours resolve from semantic tokens,
 * so it re-themes in light and dark. Announced via `role="alert"`.
 *
 * ```tsx
 * <Alert intent="danger" title="Payment failed">
 *   Update your card and try again.
 * </Alert>
 * ```
 */
export function Alert({ intent = 'neutral', title, icon, children }: AlertProps) {
  const accent = ACCENT[intent];
  return (
    <Box
      role="alert"
      display="flex"
      flexDirection="row"
      gap="$space.3"
      p="$space.4"
      bg="$colors.surface.muted"
      borderRadius="$radii.md"
      borderWidth="$borderWidths.thin"
      borderColor={accent}
    >
      {icon ? <Box flexShrink={0}>{icon}</Box> : null}
      <Box display="flex" flexDirection="column" gap="$space.1" flex={1}>
        {title ? (
          <Text fontWeight="$fontWeights.semibold" color={accent}>
            {title}
          </Text>
        ) : null}
        {children ? (
          <Text fontSize="$fontSizes.sm" color="$colors.text.muted">
            {children}
          </Text>
        ) : null}
      </Box>
    </Box>
  );
}
