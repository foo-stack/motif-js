import type { StyledConfig } from 'usemotif';

/**
 * Card recipe — a surface container with `elevation` and `padding` variants.
 *
 * ```tsx
 * const Card = styled(Box, cardRecipe);
 * <Card elevation="raised" padding="lg">…</Card>;
 * ```
 *
 * `raised` uses a box-shadow on web; on native, shadows need the platform
 * shadow props, so style the elevation there from the call site.
 */
export const cardRecipe = {
  base: {
    display: 'flex',
    flexDirection: 'column',
    bg: '$colors.surface.raised',
    borderRadius: '$radii.lg',
    borderWidth: '$borderWidths.thin',
    borderColor: '$colors.border.muted',
  },
  variants: {
    elevation: {
      flat: { borderColor: '$colors.border.default' },
      raised: { boxShadow: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)' },
    },
    padding: {
      none: { padding: 0 },
      sm: { padding: '$space.3' },
      md: { padding: '$space.4' },
      lg: { padding: '$space.6' },
    },
  },
  defaultVariants: { elevation: 'flat', padding: 'md' },
} as const satisfies StyledConfig;
