import type { ReactNode } from 'react';
import { Box, HStack, Text, VStack } from '@motif-js/react';
import { AlertOctagon, AlertTriangle, Info, Lightbulb } from '@motif-js/icons';

export type CalloutKind = 'info' | 'tip' | 'warning' | 'danger';

export interface CalloutProps {
  kind?: CalloutKind;
  title?: string;
  children: ReactNode;
}

interface KindStyle {
  readonly icon: typeof Info;
  readonly accent: string;
  readonly tint: string;
  readonly label: string;
}

const KIND_STYLES: Record<CalloutKind, KindStyle> = {
  info: {
    icon: Info,
    accent: '$colors.action.info.bg',
    tint: 'rgb(71 85 105 / 0.06)',
    label: 'Note',
  },
  tip: {
    icon: Lightbulb,
    accent: '$colors.accent',
    tint: '$colors.accentSoft',
    label: 'Tip',
  },
  warning: {
    icon: AlertTriangle,
    accent: '$colors.action.warning.bg',
    tint: 'rgb(180 83 9 / 0.08)',
    label: 'Warning',
  },
  danger: {
    icon: AlertOctagon,
    accent: '$colors.action.danger.bg',
    tint: 'rgb(185 28 28 / 0.08)',
    label: 'Heads up',
  },
};

/**
 * Bordered callout block. Hairline left edge in the variant color,
 * faint tinted background, glyph + optional title. Used in MDX as:
 *
 *   <Callout kind="tip" title="On native">
 *     Shadows compile to elevation on Android…
 *   </Callout>
 */
export function Callout({ kind = 'info', title, children }: CalloutProps) {
  const style = KIND_STYLES[kind];
  const Icon = style.icon;
  return (
    <Box
      role="note"
      aria-label={title ?? style.label}
      my="$5"
      borderRadius="$radii.lg"
      borderWidth={1}
      borderStyle="solid"
      borderColor="$colors.border.muted"
      borderLeftWidth={3}
      borderLeftStyle="solid"
      borderLeftColor={style.accent}
      bg={style.tint}
      px="$5"
      py="$4"
    >
      <HStack alignItems="flex-start" gap="$3">
        <Box
          display="inline-flex"
          color={style.accent}
          fontSize={18}
          mt={2}
          flexShrink={0}
          aria-hidden="true"
        >
          <Icon />
        </Box>
        <VStack gap="$2" alignItems="stretch" flex={1} minWidth={0}>
          {title !== undefined && (
            <Text
              as="strong"
              fontFamily="$fonts.sans"
              fontSize="$fontSizes.sm"
              fontWeight="$fontWeights.semibold"
              color="$colors.text.strong"
              lineHeight="$lineHeights.snug"
            >
              {title}
            </Text>
          )}
          <Box
            color="$colors.text.default"
            fontSize="$fontSizes.sm"
            lineHeight="$lineHeights.normal"
          >
            {children}
          </Box>
        </VStack>
      </HStack>
    </Box>
  );
}
